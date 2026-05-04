require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
let welcomeChannelId = null;
let welcomeMessage = '🎉 حياك الله في السيرفر!';
let mentionUser = true;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

// جاهزية البوت
client.once('ready', () => {
  console.log(`✅ البوت شغال ${client.user.tag}`);
});

// الترحيب عند دخول عضو
client.on('guildMemberAdd', member => {
 const channel = member.guild.channels.cache.get(welcomeChannelId);

if (!channel) return;
  if (mentionUser) {
    channel.send(`${member} ${welcomeMessage}`);
  } else {
    channel.send(welcomeMessage);
  }
});

// أوامر عادية
client.on('messageCreate', message => {
  if (message.content === '!ping') {
    message.reply('🏓 Pong!');
  }

  if (message.content === '!testwelcome') {
    message.channel.send(`${message.author} ${welcomeMessage}`);
  }
});

// أمر /welcome
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'welcome') {
    const channel = interaction.options.getChannel('channel');

if (channel) welcomeChannelId = channel.id;

    const text = interaction.options.getString('text');
    const mention = interaction.options.getBoolean('mention');

    if (text) welcomeMessage = text;
    if (mention !== null) mentionUser = mention;

    let preview = mentionUser ? `${interaction.user} ${welcomeMessage}` : welcomeMessage;

    await interaction.reply(`✅ تم التحديث\n\n📢 تجربة:\n${preview}`);

  }
});

// تسجيل الأمر
const commands = [
  new SlashCommandBuilder()
    .setName('welcome')
    .setDescription('تعديل رسالة الترحيب')
    .addStringOption(option =>
      option.setName('text')
        .setDescription('رسالة الترحيب')
        .setRequired(false))
    .addBooleanOption(option =>
      option.setName('mention')
        .setDescription('هل يمنشن العضو؟')
        .setRequired(false))
        .addChannelOption(option =>
  option.setName('channel')
    .setDescription('اختار روم الترحيب')
    .setRequired(false))
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands('1500827664494366841', '1500514959610740759'),
      { body: commands }
    );
    console.log('✅ تم تسجيل /welcome');
  } catch (error) {
    console.error(error);
  }
})();

client.login(process.env.TOKEN);