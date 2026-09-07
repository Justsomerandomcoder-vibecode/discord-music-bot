require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandsPath);

for (const folder of commandFolders) {
  const folderPath = path.join(commandsPath, folder);
  if (!fs.statSync(folderPath).isDirectory()) continue;

  const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(folderPath, file);
    const command = require(filePath);
    if (command.data) {
      commands.push(command.data.toJSON());
      console.log(`📝 Prepared command: ${command.data.name}`);
    }
  }
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log(`\n🔄 Deploying ${commands.length} commands...\n`);

    if (process.env.GUILD_ID) {
      // Deploy to specific guild (faster for testing)
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
        { body: commands }
      );
      console.log(`✅ Successfully deployed commands to guild ${process.env.GUILD_ID}\n`);
    } else {
      // Deploy globally
      await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        { body: commands }
      );
      console.log('✅ Successfully deployed commands globally\n');
    }
  } catch (error) {
    console.error('Error deploying commands:', error);
    process.exit(1);
  }
})();
