"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const zod_1 = require("zod");
const path_1 = __importDefault(require("path"));
const promises_1 = require("fs/promises");
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
server.registerResource("users_json", "users://all", {
    description: "A local JSON resource containing user data",
    title: "Users",
    mimeType: "application/json"
}, async (uri) => {
    const filePath = path_1.default.join(process.cwd(), "src/data/users.json");
    const fileContent = await (0, promises_1.readFile)(filePath, "utf-8");
    return {
        contents: [
            {
                uri: uri.href, // what uri we trying to access -> here it is users://all 
                mimeType: "application/json",
                text: fileContent
            }
        ]
    };
});
async function createUserInDatabase(userDetails) {
    const filePath = path_1.default.join(process.cwd(), "src/data/users.json");
    const fileContent = await (0, promises_1.readFile)(filePath, "utf-8");
    const userData = JSON.parse(fileContent);
    console.error("Existing Users:", userData);
    const data = userData;
    data.push(...userData, userDetails);
    const upddatedContent = JSON.stringify(data, null, 2);
    await (0, promises_1.writeFile)(filePath, upddatedContent, "utf-8");
    return userDetails.id;
}
async function main() {
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
}
main();
