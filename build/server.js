"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const zod_1 = require("zod");
const data_js_1 = __importDefault(require("./data/data.js"));
// Create server instance
const server = new mcp_js_1.McpServer({
    name: "test-app",
    version: "1.0.0"
});
server.registerTool("create_user", {
    description: "Create a new user with a username and email",
    inputSchema: {
        userName: zod_1.z.string().describe("The desired username for the new user"),
        email: zod_1.z.string().describe("The email address of the new user")
    },
}, async ({ userName, email }) => {
    try {
        // Simulate user creation logic
        const userId = Math.floor(Math.random() * 10000).toString();
        if (!userName || !email) {
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
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `User creation Failed!: ${JSON.stringify(error)}`
                }
            ]
        };
    }
});
async function createUserInDatabase(userDetails) {
    const users = [...data_js_1.default];
    users.push({ ...userDetails });
    return userDetails.id;
}
async function main() {
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
}
main();
