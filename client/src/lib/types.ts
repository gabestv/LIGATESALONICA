// Additional types for the frontend that aren't part of the schema

export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar?: string;
}

export interface DiscordRole {
  id: string;
  name: string;
  color: number;
  position: number;
  permissions: string;
}

export interface DiscordGuild {
  id: string;
  name: string;
  icon?: string;
  members: number;
}

export interface DiscordChannel {
  id: string;
  name: string;
  type: number;
}

export interface BotConfig {
  prefix: string;
  dmRole: string;
  adminOnly: boolean;
}

export interface BotStats {
  servers: number;
  users: number;
  commands: number;
  uptime: number;
}

export enum PermissionLevel {
  ADMIN = 'admin',
  DM = 'dm',
  PLAYER = 'player'
}

export interface CommandExample {
  command: string;
  description: string;
  example: string;
  response: string;
}
