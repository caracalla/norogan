# norogan

When a Joe Rogan video is posted in your Discord channel, this bot will say "WARNING! JOE ROGAN VIDEO!".  The bot uses the YouTube Data API to see if the title contains "joe rogan".

## Setup

1. Create `discord_auth.json` with the following structure:
    ```json
    {
      "token": "<your discord bot token>"
    }
    ```
2. Create `youtube_auth.json` with the following structure:
    ```json
    {
      "key": "<your youtube data API key.>"
    }
    ```
3. `yarn install`
4. `node index.js`

## TODO
* Look for "joe rogan" in other areas if the title isn't a match (tags, description)
* Use emoji or something
