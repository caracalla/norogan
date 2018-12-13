# norogan

When any Joe Rogan-related content is posted in your discord channel, this bot will post a humorous image.

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
* Respond to being highlighted
* Implement Twitter, bit.ly, and other links that can be investigated for possible Joe Rogan content
* Pick a more robust way to post the image?
* Look for "joe rogan" in other areas if the title isn't a match (tags, description)
* Use emoji or something
