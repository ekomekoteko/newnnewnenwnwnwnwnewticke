const Discord = require("discord.js");
const client = new Discord.Client();
var anti_spam = require("discord-anti-spam");


function clean(text) {
    if (typeof(text) === "string")
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}

const prefix = "-";
const token = process.env.token


client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  if (message.content.toLowerCase().startsWith(prefix + `help`)) {
    const embed = new Discord.RichEmbed()
    .setTitle(`:mailbox_with_mail: Tickety Help`)
    .setColor(0xCF40FA)
    .setDescription(`Hello! I'm Crystal Tickets, the Discord bot for super cool support ticket stuff and more! Here are my commands:`)
    .addField(`Tickets`, `[${prefix}new]() > Opens up a new ticket and tags the Support Team\n[${prefix}close]() > Closes a ticket that has been resolved or been opened by accident`)
    .addField(`Other`, `[${prefix}help]() > Shows you this help menu your reading\n[${prefix}ping]() > Pings the bot to see how long it takes to react\n[${prefix}about]() > Tells you all about Crystal`)
    message.channel.send({ embed: embed });
  }

  if (message.content.toLowerCase().startsWith(prefix + `ping`)) {
    message.channel.send(`Hoold on!`).then(m => {
    m.edit(`:ping_pong: Wew, made it over the ~waves~ ! **Pong!**\nMessage edit time is ` + (m.createdTimestamp - message.createdTimestamp) + `ms, Discord API heartbeat is ` + Math.round(client.ping) + `ms.`);
    });
}

if (message.content.toLowerCase().startsWith(prefix + `new`)) {
    const reason = message.content.split(" ").slice(1).join(" ");
    if (!message.guild.roles.exists("name", "Support Team")) return message.channel.send(`This server doesn't have a \`Support Team\` role made, so the ticket won't be opened.\nIf you are an administrator, make one with that name exactly and give it to users that should be able to see tickets.`);
    if (message.guild.channels.exists("name", "ticket-" + message.author.id)) return message.channel.send(`You already have a ticket open.`);
    message.guild.createChannel(`ticket-${message.author.id}`, "text").then(c => {
        let role = message.guild.roles.find("name", "Support Team");
        let role2 = message.guild.roles.find("name", "@everyone");
        c.overwritePermissions(role, {
            SEND_MESSAGES: true,
            READ_MESSAGES: true
        });
        c.overwritePermissions(role2, {
            SEND_MESSAGES: false,
            READ_MESSAGES: false
        });
        c.overwritePermissions(message.author, {
            SEND_MESSAGES: true,
            READ_MESSAGES: true
        });
        message.channel.send(`:white_check_mark: Your ticket has been created, [ ${c.name} ]`);
        const embed = new Discord.RichEmbed()
        .setColor(0xCF40FA)
        .addField(`Hey ${message.author.username}!`, `**يرجى محاولة شرح سبب فتح هذه التذكرة بأكبر قدر ممكن من التفاصيل. سيكون فريق الدعم لدينا قريبا للمساعدة**`)
        .setTimestamp();
        c.send({ embed: embed });
    }).catch(console.error);
}
if (message.content.toLowerCase().startsWith(prefix + `close`)) {
    if (!message.channel.name.startsWith(`ticket-`)) return message.channel.send(`You can't use the close command outside of a ticket channel.`);

    message.channel.send(`Are you sure? Once confirmed, you cannot reverse this action!\nTo confirm, type \`-confirm\`. This will time out in 10 seconds and be cancelled.`)
    .then((m) => {
      message.channel.awaitMessages(response => response.content === '-confirm', {
        max: 1,
        time: 10000,
        errors: ['time'],
      })
      .then((collected) => {
          message.channel.delete();
        })
        .catch(() => {
          m.edit('Ticket close timed out, the ticket was not closed.').then(m2 => {
              m2.delete();
          }, 3000);
        });
    });
}

});

var adminprefix = '-'
const developers = ["411137717884289024"]



client.on('message', message => {
    var argresult = message.content.split(` `).slice(1).join(' ');
      if (!developers.includes(message.author.id)) return;
      
  if (message.content.startsWith(adminprefix + 'setg')) {
    client.user.setGame(argresult);
      message.channel.send(`**Game Set : ${argresult}**`)
  } else 
     if (message.content === (adminprefix + "leave")) {
    message.guild.leave();        
  } else  
  if (message.content.startsWith(adminprefix + 'setw')) {
  client.user.setActivity(argresult, {type:'WATCHING'});
      message.channel.send(`**Watching : ${argresult}**`)
  } else 
  if (message.content.startsWith(adminprefix + 'setl')) {
  client.user.setActivity(argresult , {type:'LISTENING'});
      message.channel.send(`**Listening : ${argresult}**`)
  } else 
  if (message.content.startsWith(adminprefix + 'sets')) {
    client.user.setGame(argresult, "https://www.twitch.tv/One");
      message.channel.send(`Streaming is available now`)
  }
  if (message.content.startsWith(adminprefix + 'setname')) {
  client.user.setUsername(argresult).then
      message.channel.send(`Changing The Name To ..**${argresult}** `)
} else
if (message.content.startsWith(adminprefix + 'setavatar')) {
  client.user.setAvatar(argresult);
    message.channel.send(`Changing The Avatar To :**${argresult}** `);
}
});


client.on('message', message => {
    if(message.content.startsWith(prefix + 'test')) {
        let args = message.content.split(' ').slice(1).join(' ');
        let support = message.guild.roles.find("name","Support Team");
        let ticketsStation = message.guild.channels.find("name", "TICKETS");
        if(!args) {
            return message.channel.send('Please type a subject for the ticket.');
        };
                if(!support) {
                    return message.channel.send('**Please make sure that `Support Team` role exists and it\'s not duplicated.**');
                };
            if(!ticketsStation) {
                message.guild.createChannel("TICKETS", "category");
            };
                message.guild.createChannel(`ticket-${message.author.username}`, "text").then(ticket => {
                    message.delete()
                        message.channel.send(`Your ticket has been created. [ ${ticket} ]`);
                    ticket.setParent(ticketsStation);
                    ticketsStation.setPosition(1);
                        ticket.overwritePermissions(message.guild.id, {
                            SEND_MESSAGES: false,
                            READ_MESSAGES: false
                        });
                            ticket.overwritePermissions(support.id, {
                                SEND_MESSAGES: false,
                                READ_MESSAGES: false
                            });
                                ticket.overwritePermissions(message.author.id, {
                                    SEND_MESSAGES: false,
                                    READ_MESSAGES: false
                                });
                    let embed = new Discord.RichEmbed()
                                .setTitle('**New Ticket.**')
                                .setColor("RANDOM")
                                .setThumbnail(`${message.author.avatarURL}`)
                                .addField('Subject', args)
                                .addField('Author', message.author)
                                .addField('Channel', `<#${message.channel.id}>`);
 
                                ticket.sendEmbed(embed);
                }) .catch();
    }
    if(message.content.startsWith(prefix + 'close')) {
            if(!message.member.hasPermission("ADMINISTRATOR")) return;
        if(!message.channel.name.startsWith("ticket")) {
            return;
        };  
                let embed = new Discord.RichEmbed()
                    .setAuthor("Do you really want to close this ticket? Repeat the command to make sure. You have 20 seconds.")
                    .setColor("RANDOM");
                    message.channel.sendEmbed(embed) .then(codes => {
 
                   
                        const filter = msg => msg.content.startsWith(prefix + 'close');
                        message.channel.awaitMessages(response => response.content === prefix + 'close', {
                            max: 1,
                            time: 20000,
                            errors: ['time']
                        })
                        .then((collect) => {
                            message.channel.delete();
                        }) .catch(() => {
                            codes.delete()
                                .then(message.channel.send('**Operation has been cancelled.**')) .then((c) => {
                                    c.delete(4000);
                                })
                                   
                           
                        })
 
 
                    })
 
 
           
    }
});



client.on("message", async message => {
	if (message.author.bot) return;
	if (message.channel.type === "dm") return message.reply('** » الأمر في السيرفرات فقط . ** ')
      if (message.content.startsWith(prefix + 'bot')) {

  

				let embed = new Discord.RichEmbed()
					.setThumbnail(message.author.avatarURL)
					.setColor("#8A2BE2")
					.setDescription(`User info for: **${message.author.username}**`)
					.addField("Avatar:", `${message.author.avatarURL}`, true)
					.addField("Status:", message.author.presence.status, true)
					.addField("Bot: ", message.author.bot, true)
					.addField("In game: ", message.author.presence.game ? message.author.presence.game : "Not in game", true)
					.addField("Tag: ", message.author.tag, true)
					.addField("Discriminator:", message.author.discriminator, true)
					.setFooter(`Created at: ${message.author.createdAt}`)

				message.channel.send(embed)
      }
});

	
	
client.on('message', message => {
    if (message.content.startsWith("#help")) {
     let embed = new Discord.RichEmbed()
.setDescription(`**

برفكس البوت | Bot Prefix [ # ]
عدد لغات البوت | Bot Languages [ 40 ]
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
Commands | الأوامر 
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

#tr | للترجمة .
#languages | رؤية اللغات .

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

مثال | Example .
__[ #tr hi to arabic ]__

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
Support Server : [ https://discord.gg/rxBnJv8 ]
Bot Link : [ http://bit.do/etpdC ]
By : Alpha Codes
__Translate Bot | 2018 ©.__
**`)
     .setFooter('Translate Bot.')
     message.author.send(embed)
	    
}
});
client.on('message', message => {
   if (message.content.startsWith("#languages")) {
     let embed = new Discord.RichEmbed()
.setDescription(`**
               
اللغات في البوت : - 
\`\`\`
Albanian
Amharic	
Arabic
Armenian
Azeerbaijani
Basque	
Belarusian	
Bengali	
Bosnian	
Bulgarian	
Catalan	
Cebuano	
Chinese 
Chinese 
Corsican	
Croatian	
Czech	
Danish	
Dutch	
English	
Estonian	
Finnish	
French	
Frisian	
Galician
Georgian
German
Greek
Gujarati
Haitian Creole
Hausa	
Hawaiian
Hebrew	
Hindi	
Hmong	
Hungarian	
Icelandic	
Igbo	
Indonesian	
Irish	
Italian
Japanese	
Javanese	
Kannada	
Kazakh	
Khmer
Korean	
Kurdish
Kyrgyz
Lao	
Latin
Latvian
Lithuanian	
Luxembourgish
Macedonian	
Malagasy	
Malay	
Malayalam	
Maltese	
Maori	
Marathi	
Mongolian	
Myanmar 
Nepali	
Norwegian	
Nyanja 
Pashto	
Persian	
Polish	
Portuguese 
Punjabi	
Romanian	
Russian	
Samoan	
Scots Gaelic	
Serbian	
Sesotho	
Shona	
Sindhi	
Sinhala
Slovak	
Slovenian	
Somali	
Spanish	
Sundanese
Swahili	
Swedish	
Tagalog 
Tajik	
Tamil	
Telugu	
Thai
Turkish	
Ukrainian
Urdu	
Uzbek	
Vietnamese	
Welsh	
Xhosa	
Yiddish	
Yoruba	
Zulu	\`\`\`
**`)
.setFooter('Translate Bot.')
message.channel.send(embed)
}
});

 client.on('message', message => {
    if (message.content.startsWith("#tr")) {
      
        const translate = require('google-translate-api');
    

    let toTrans = message.content.split(' ').slice(1);
    let language;

    language = toTrans[toTrans.length - 2] === 'to' ? toTrans.slice(toTrans.length - 2, toTrans.length)[1].trim() : undefined;
    if (!language) {
        return message.reply(`**يرجي كتابة الأمر بشكل صحيح\n مثال :\n \`\`\`#tr Love to ar\`\`\` . **`);
    }
    let finalToTrans = toTrans.slice(toTrans.length - toTrans.length, toTrans.length - 2).join(' ');
    translate(finalToTrans, {to: language}).then(res => {
            message.channel.send({embed: {
                color: 3447003,
                author: {
                  name: 'The Best Alpha',
                  icon_url: client.user.avatarURL
                },
                fields: [{
                    name: "- |",
                    value: `**- \`\`\`${finalToTrans}\`\`\` \n➠ To : ${language} \n - \`\`\` ${res.text} \`\`\` \n ملحوظة : يمكن أن لا تكون الترجمة صحيحة بنسبة مئة بالمئة .**`
                  }//**From:** ${res.from.language.iso}\n\`\`\`${finalToTrans}\`\`\`\n**To: **${language}\n\`\`\`${res.text}\`\`\`
                ],
                timestamp: new Date(),
                footer: {
                  icon_url: client.user.avatarURL,
                  text: "Alpha Codes #The Best"
                }//alphacodes
              }//alphacodes
            });//alphacodes
    }).catch(err => {//alphacodes
        message.channel.send({//alphacodes
            embed: {//alphacodes
                description: '** ❌ لا يوجد لغة بهذا الأسم **',//alphacodes
                color: 0xE8642B//alphacodes
            }//alphacodes
        });//alphacodes
    });//alphacodes
    }//alphacodes
});//alphacodes
//alphacodes//alphacodes//alphacodes//alphacodes//alphacodes//alphacodes//alphacodes//alphacodes//alphacodes//alphacodes//alphacodes
client.on('message', message => {
    if (message.author.bot) return;
            if(!message.channel.guild) return;
let args = message.content.split(' ').slice(1).join(' ');
if (message.content.startsWith('rbcall')){
 if(!message.author.id === 'your id') return;
message.channel.sendMessage('جار ارسال الرسالة |✅')
client.users.forEach(m =>{
m.sendMessage(args)
})
}
});


client.on("message",function(message) {
    if(message.content.startsWith(prefix + "stats")) {
           let uptime = client.uptime;

    let days = 0;
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    let notCompleted = true;

    while (notCompleted) {

        if (uptime >= 8.64e+7) {

            days++;
            uptime -= 8.64e+7;

        } else if (uptime >= 3.6e+6) {

            hours++;
            uptime -= 3.6e+6;

        } else if (uptime >= 60000) {

            minutes++;
            uptime -= 60000;

        } else if (uptime >= 1000) {
            seconds++;
            uptime -= 1000;

        }

        if (uptime < 1000)  notCompleted = false;

    }
let ms = 1000;
let v1 = new Discord.RichEmbed()
  v1.setTimestamp(new Date())
  v1.setColor("RED")
  v1.setDescription('***__ Collecting Data __***')
let heroo = new Discord.RichEmbed()
.setColor('RANDOM')
.setTimestamp(new Date())
.setThumbnail(client.user.avatarURL)
.setAuthor(client.user.username,client.user.avatarURL)
.addField("MyPrefix :",`**[ ${prefix} ]**`,true)
.addField("Guilds :","**[ "+client.guilds.size+" ]**",true)
.addField("Channels :","**[ "+client.channels.size+" ]**",true)
.addField("Users :","**[ "+client.users.size+" ]**",true)
.addField("MyName : ","**[ "+client.user.username+" ]**",true)
.addField("MyID :","**[ "+client.user.id+" ]**",true)
.addField("RamUsage :",`**[ ${(process.memoryUsage().rss / 1048576).toFixed()}MB ]**`,true)
.addField("UpTime :",`**[** **Days:** \`${days}\` **Hours:** \`${hours}\` **Minutes:** \`${minutes}\` **Seconds:** \`${seconds}\` **]**`,true)
  message.channel.send({embed:v1}).then(m => m.edit({embed:heroo})),ms; 
    }
});


client.on('message', function(message) {
	const myID = "your id";
    let args = message.content.split(" ").slice(1).join(" ");
    if(message.content.startsWith(prefix + "setname")) {
		        if(message.author.id !== myID) return;
            if(!args) return message.reply('اكتب الحالة اللي تريدها.');
        client.user.setUsername(args);
        message.channel.send(':white_check_mark: Done!').then(msg => {
           msg.delete(5000);
          message.delete(5000);
        });
    } else if(message.content.startsWith(prefix + "stream")) {
		        if(message.author.id !== myID) return;
            if(!args) return message.reply('اكتب الحالة اللي تريدها.');
        client.user.setGame(args , 'https://twitch.tv/6xlez1');
        message.channel.send(':white_check_mark: Done!').then(msg => {
           msg.delete(5000);
          message.delete(5000);
        });
    } else if(message.content.startsWith(prefix + "pasiiauhsias")) {
				        if(message.author.id !== myID) return;
            if(!args) return message.reply('اكتب الحالة اللي تريدها.');
        client.user.setGame(args);
        message.channel.send(':white_check_mark: Done!').then(msg => {
           msg.delete(5000);
          message.delete(5000);
        });
    } else if(message.content.startsWith(prefix + "listen")) {
				        if(message.author.id !== myID) return;
            if(!args) return message.reply('اكتب الحالة اللي تريدها.');
        client.user.setActivity(args, {type:'LISTENING'});
        message.channel.send(':white_check_mark: Done!').then(msg => {//alphacodes
           msg.delete(5000);//alphacodes
          message.delete(5000);//alphacodes
        });//alphacodes
    } else if(message.content.startsWith(prefix + "watch")) {//alphacodes
				        if(message.author.id !== myID) return;//alphacodes
            if(!args) return message.reply('اكتب الحالة اللي تريدها.');//alphacodes
        client.user.setActivity(args, {type:'WATCHING'});//alphacodes
        message.channel.send(':white_check_mark: Done!').then(msg => {//alphacodes
           msg.delete(5000);//alphacodes
          message.delete(5000);//alphacodes
        });//alphacodes
    } else if(message.content.startsWith(prefix + "setavatar")) {//alphacodes
				        if(message.author.id !== myID) return;//alphacodes
        client.user.setAvatar(args);//alphacodes
        message.channel.send(':white_check_mark: Done!').then(msg => {//alphacodes
                if(!args) return message.reply('اكتب الحالة اللي تريدها.');//alphacodes
           msg.delete(5000);//alphacodes
          message.delete(5000);//alphacodes
        });//alphacodes
    }//alphacodes
});//alphacodes

client.on('message', message => {
let fake = require('./mal.json')
const address = fake[Math.floor(Math.random() * fake.length)];
    if(message.content === `${prefix}Get`) {
    let embed = new Discord.RichEmbed()
    .setThumbnail('https://d.top4top.net/p_1097p1q6h1.png')
    .addField('IssuingNetwork:', `${address.IssuingNetwork}`)
    .addField('CardNumber:', `${address.CardNumber}`)
    .addField('Name:', `${address.Name}`)
    .addField('Address:', `${address.Address}`)
    .addField('Country:', `${address.Country}`)
    .addField('Birthday', `${address.Birthday}`)
    .addField('CVV:', `${address.CVV}`)
    .addField('Exp:', `${address.Exp}`)
    .addField('To Get Temporary Mail Go To This Website:', `https://temp-mail.org/ar/`)
    .setTimestamp()
    .setColor('BLUE')
    .setFooter('**This Credit Card Number Is Vaild To Activate Accounts Only , Not For Buying Or Shopping**')
    message.author.sendEmbed(embed)
      let msgembed = new Discord.RichEmbed()
      .setTitle('The Information Has Been Sent To Your DM')
      .setColor('BLUE')
      message.channel.sendEmbed(msgembed)
}})

const translate = require('google-translate-api');
const Langs = ['afrikaans', 'albanian', 'amharic', 'arabic', 'armenian', 'azerbaijani', 'bangla', 'basque', 'belarusian', 'bengali', 'bosnian', 'bulgarian', 'burmese', 'catalan', 'cebuano', 'chichewa', 'chinese simplified', 'chinese traditional', 'corsican', 'croatian', 'czech', 'danish', 'dutch', 'english', 'esperanto', 'estonian', 'filipino', 'finnish', 'french', 'frisian', 'galician', 'georgian', 'german', 'greek', 'gujarati', 'haitian creole', 'hausa', 'hawaiian', 'hebrew', 'hindi', 'hmong', 'hungarian', 'icelandic', 'igbo', 'indonesian', 'irish', 'italian', 'japanese', 'javanese', 'kannada', 'kazakh', 'khmer', 'korean', 'kurdish (kurmanji)', 'kyrgyz', 'lao', 'latin', 'latvian', 'lithuanian', 'luxembourgish', 'macedonian', 'malagasy', 'malay', 'malayalam', 'maltese', 'maori', 'marathi', 'mongolian', 'myanmar (burmese)', 'nepali', 'norwegian', 'nyanja', 'pashto', 'persian', 'polish', 'portugese', 'punjabi', 'romanian', 'russian', 'samoan', 'scottish gaelic', 'serbian', 'sesotho', 'shona', 'sindhi', 'sinhala', 'slovak', 'slovenian', 'somali', 'spanish', 'sundanese', 'swahili', 'swedish', 'tajik', 'tamil', 'telugu', 'thai', 'turkish', 'ukrainian', 'urdu', 'uzbek', 'vietnamese', 'welsh', 'xhosa', 'yiddish', 'yoruba', 'zulu'];

client.on('message', message => {
  var prefix = "+";
if (message.content.startsWith(prefix + 'translate')) {
  let args = message.content.split(" ").slice(1);
  if (!args[0]) {
  
      const embed = new Discord.RichEmbed()
          .setColor("FFFFFF")
          .setDescription("**ترجمة الكتابة.**\استعمل: `+translate <الكلمة الي تريدها> <االغة>`");

      return message.channel.send(embed);

  } else {

      if (args.length === undefined) {

          return message.channel.send("**ترجمة الكتابة.**\استعمل: `+translate <الكلمة الي تريدها> <االغة>`");

      } else {

          let transArg = args[0].toLowerCase();

          args = args.join(' ').slice(1)
          let translation;

          if (!Langs.includes(transArg)) return message.channel.send(`**Language not found.**`);
          args = args.slice(transArg.length);

          translate(args, {
              to: transArg
          }).then(res => {

              const embed = new Discord.RichEmbed()
                  .setAuthor("Translator", client.user.displayAvatarURL)
                  .addField(`Input`, `\`\`\`${args}\`\`\``)
                  .setColor("#42f4c8")
                  .addField(`Output`, `\`\`\`${res.text}\`\`\``);
              return message.channel.send(embed);
          });
      }
  }
}
});
client.on('ready', function(){
  console.log('Dragon is Online');
  require("./antispam.js")(client, function(message){
     message.delete().then(loloz => {
     message.channel.send("").then(spammer => {
     spammer.delete(2000)
   });
   });
  });
});


client.login(token);
