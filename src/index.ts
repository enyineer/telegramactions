import { TelegramClient } from "telegram";
import { StoreSession } from "telegram/sessions";
import { input, select, password } from "@inquirer/prompts";
import { massDelete } from "./actions/massDelete";
import "dotenv/config";

const getEnv = (name: string) => {
  const val = process.env[name];
  if (val === undefined || val === null || val === "") {
    throw new Error("Missing environment variable " + name);
  }
  return val;
};

const apiId = parseInt(getEnv("API_ID"));
const apiHash = getEnv("API_HASH");
const storeSession = new StoreSession("tgsession");

type Action = "massDelete" | "exit";

const init = async () => {
  console.log("Starting Client...");
  const client = new TelegramClient(storeSession, apiId, apiHash, {
    connectionRetries: 5,
  });
  await client.start({
    phoneNumber: async () => {
      return await input({
        message: "Please enter your phone number:",
        required: true,
      });
    },
    password: async () => {
      return await password({
        message: "Please enter your password:",
      });
    },
    phoneCode: async () => {
      return await input({
        message: "Please enter your one time login code:",
        required: true,
      });
    },
    onError: (err) => console.log(err),
  });
  client.session.save();
  console.log("Connected to Telegram!");
  return client;
};

const client = await init();

const selectAction = async () => {
  const answer = await select<Action>({
    message: "Select your action",
    choices: [
      {
        name: "Mass Deletion of Messages",
        value: "massDelete",
        description: "Mass delete your own messages from a Chat.",
      },
      {
        name: "Exit Program",
        value: "exit",
        description: "Exits the Program.",
      },
    ],
  });

  switch (answer) {
    case "massDelete":
      await massDelete(client);
      break;
    case "exit":
      console.log("Goodbye!");
      process.exit(0);
    default:
      throw new Error(`Unknown action: ${answer}`);
  }

  await selectAction();
};

await selectAction();
