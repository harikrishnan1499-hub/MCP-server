import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {  z } from "zod";
import data from "./data/data.js";
import path from "path";
import { readFile } from "fs/promises";

// Create server instance
const server = new McpServer({
  name: "test-app",
  version: "1.0.0"
});


server.registerTool("create_user",
  {
    description: "Create a new user with a username and email",
    inputSchema: {
    userName: z.string().describe("The desired username for the new user"),
    email: z.string().describe("The email address of the new user")
    },
  },
  async({userName, email})=>{ 

    try {
      // Simulate user creation logic
    const userId = Math.floor(Math.random() * 10000).toString();
    if(!userName || !email){
       return {
      content: [
        {
          type: "text",
          text: `User creation Failed!: Missing username or email`
        }
      ]
    };
    }
        const userDetails = { id: userId, userName, email };
        const result = await createUserInDatabase(userDetails);

     // Return the expected response structure
      return {
      content: [
        {
          type: "text",
          text: `User created successfully: ${JSON.stringify(result)}`
        }
      ]
    };
    } catch (error) {
      return {
      content: [
        {
          type: "text",
          text: `User creation Failed!: ${JSON.stringify(error)}`
        }
      ]
    };
    }
  }
)

server.registerResource(
  {
    uri: "local/user",
    name: "Local user JSON",
    description: "A local JSON resource containing user data",
    },
    async () => {
      const filePath = path.join(process.cwd(), "src/data/users.json");
      const fileContent = await readFile(filePath, "utf-8");
      return {
        contents: [
          {
            uri: "local/user",
            mimeType: "application/json",
            text: fileContent
          }
        ]
      }
    }
 );

async function createUserInDatabase(userDetails: { id: string; userName: string; email: string; }) {
    const users = [...data];
    users.push({...userDetails });
    return userDetails.id; 

} 
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main();