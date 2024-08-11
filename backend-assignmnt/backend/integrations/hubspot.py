# slack.py

import asyncio
import json
import secrets
from fastapi import HTTPException, Request
from fastapi.responses import HTMLResponse
import httpx

from integrations.integration_item import IntegrationItem
from redis_client import add_key_value_redis, delete_key_redis, get_value_redis

HUBSPOT_APP_ID = "XXX"
HUBSPOT_CLIENT_ID = "XXX"
HUBSPOT_CLIENT_SECRET = "XXX"

REDIRECT_URI = "http://localhost:8000/integrations/hubspot/oauth2callback"
authorization_url = f"https://app.hubspot.com/oauth/authorize?client_id={HUBSPOT_CLIENT_ID}&scope=crm.objects.contacts.read&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fintegrations%2Fhubspot%2Foauth2callback"


async def authorize_hubspot(user_id, org_id):
    state_data = {
        "state": secrets.token_urlsafe(32),
        "user_id": user_id,
        "org_id": org_id,
    }
    encoded_state = json.dumps(state_data)
    await add_key_value_redis(
        f"hubspot_state:{org_id}:{user_id}", encoded_state, expire=600
    )

    return f"{authorization_url}&state={encoded_state}"


async def oauth2callback_hubspot(request: Request):
    if request.query_params.get("error"):
        raise HTTPException(status_code=400, detail=request.query_params.get("error"))
    print(request.query_params)
    code = request.query_params.get("code")
    encoded_state = request.query_params.get("state")
    state_data = json.loads(encoded_state)

    original_state = state_data.get("state")
    user_id = state_data.get("user_id")
    org_id = state_data.get("org_id")

    saved_state = await get_value_redis(f"hubspot_state:{org_id}:{user_id}")

    if not saved_state or original_state != json.loads(saved_state).get("state"):
        raise HTTPException(status_code=400, detail="State does not match.")

    async with httpx.AsyncClient() as client:
        response, _ = await asyncio.gather(
            client.post(
                "https://api.hubapi.com/oauth/v1/token",
                data={
                    "grant_type": "authorization_code",
                    "code": code,
                    "redirect_uri": REDIRECT_URI,
                    "client_id": HUBSPOT_CLIENT_ID,
                    "client_secret": HUBSPOT_CLIENT_SECRET,
                },
                headers={
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            ),
            delete_key_redis(f"hubspot_state:{org_id}:{user_id}"),
        )

    await add_key_value_redis(
        f"hubspot_credentials:{org_id}:{user_id}",
        json.dumps(response.json()),
        expire=600,
    )

    close_window_script = """
    <html>
        <script>
            window.close();
        </script>
    </html>
    """

    return HTMLResponse(content=close_window_script)


async def get_hubspot_credentials(user_id, org_id):
    credentials = await get_value_redis(f"hubspot_credentials:{org_id}:{user_id}")
    if not credentials:
        raise HTTPException(status_code=400, detail="Credentials not found.")
    credentials = json.loads(credentials)
    if not credentials:
        raise HTTPException(status_code=400, detail="Access token not found.")

    await delete_key_redis(f"hubspot_credentials:{org_id}:{user_id}")
    return credentials


def create_integration_item_metadata_object(response_json):
    properties = response_json.get("properties")
    if not properties:
        return None

    return IntegrationItem(
        id=response_json.get("id"),
        name=f"{properties.get('firstname', '')} {properties.get('lastname', '')}",
        type=None,
        creation_time=properties.get("createdate"),
        last_modified_time=properties.get("lastmodifieddate"),
        parent_id=None
    )


async def get_items_hubspot(credentials):
    credentials = json.loads(credentials)
    access_token = credentials.get("access_token")
    if not access_token:
        raise HTTPException(status_code=400, detail="Access token not found.")

    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://api.hubapi.com/crm/v3/objects/contacts",
            headers={
                "Authorization": f"Bearer {access_token}",
            },
        )
        response_json = response.json()
        results = response_json.get("results")
        if not results:
            return None

        list_of_integration_item_metadata = []
        for result in results:
            list_of_integration_item_metadata.append(
                create_integration_item_metadata_object(result)
            )

        return list_of_integration_item_metadata
