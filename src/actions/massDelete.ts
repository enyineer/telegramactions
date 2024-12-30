import { Api, type TelegramClient } from "telegram";
import { checkbox, confirm } from "@inquirer/prompts";

export const massDelete = async (client: TelegramClient) => {
  const me = await client.getMe();
  const dialogs = await client.getDialogs();

  const chats = await checkbox({
    message: "Select chats to mass delete messages from:",
    choices: dialogs.map((dialog) => {
      return {
        name: dialog.name ?? dialog.title,
        value: dialog.id,
      };
    }),
  });

  const confirmation = await confirm({
    message: "Are you sure? This cannot be undone!",
    default: false,
  });

  if (!confirmation) {
    return;
  }

  for (const chat of chats) {
    console.log(
      `Looking for messages for chat ${chat} from user ${
        me.username ?? me.id
      }... This may take a while because of antiflood from the Telegram API!`
    );

    const messages = await client.getMessages(chat, {
      limit: undefined,
      fromUser: me.id,
    });

    console.log(
      `Found ${messages.length} messages for chat ${chat} from user ${
        me.username ?? me.id
      }. Trying deletion.`
    );

    await client.deleteMessages(
      chat,
      messages.map((message) => message.id),
      { revoke: true }
    );

    console.log(
      `Successfully deleted ${
        messages.length
      } messages for chat ${chat} from user ${me.username ?? me.id}`
    );
  }

  console.log("Finished mass deletion!");
};
