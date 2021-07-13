"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Libraries
const dotenv_1 = __importDefault(require("dotenv"));
// App
const server_1 = __importDefault(require("./server/server"));
// Environment variables
dotenv_1.default.config();
// Create new server
const server = server_1.default.instance;
// Middlewares
// Cors (Express)
server.cors();
// Read and parse body (middleware) - access to request data in body
server.body_parse();
// Routes
server.define_routes();
// Public directory
server.define_public();
// Extra routes
server.define_extra_routes();
// Start server
server.start_server(() => {
    console.log(`Server running on port: ${server.port}`);
});
