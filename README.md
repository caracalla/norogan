# norogan

When any Joe Rogan-related content is posted in your discord channel, this bot will post a humorous image.

## Setup

1. Create `secrets.json` with the following structure:
    ```json
    {
      "discord": {
        "token": "<your discord bot token>"
      },
      "youtube": {
        "key": "<your youtube data API key.>"
      }
    }
    ```
2. **Optional:** update `config.json` with the desired responses.
3. `yarn install`
4. `yarn start`

## TODO
* Implement Twitter, bit.ly, and other links that can be investigated for possible Joe Rogan content
* Youtube:
    * Look for "joe rogan" in other areas if the title isn't a match (tags, description)
* Use emoji or something
