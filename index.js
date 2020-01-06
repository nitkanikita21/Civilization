const Discord = require('discord.js')
const fs = require('fs');
const client = new Discord.Client()
var prefix = "G:"
let sessions = {};
var session_here = null;
var randomNumb = (max, min)=>{
    return min + Math.floor(Math.random() * (max - min));
}
var randomElem = (arr)=>{
    return arr[Math.floor(arr.length*Math.random())]
}
var status = [`б`,`е`,`г`,`у`,`щ`,`а`,`я`,`_`,`с`,`т`,`р`,`о`,`к`,`а`,` `]
client.on("ready",()=>{
    console.log("Started!")
    client.user.setStatus('dnd')
    var k = 1
    client.user.setActivity('alpha v.0.0.6',{type: 'WATCHING'});
})
client.on("message",(message)=>{
    if(!message.content.startsWith(prefix))return
    if(message.channel.id !== `606912875277058126`&& message.channel.type !== 'dm')return
    class session {
        constructor(race){
            if(race === undefined)race = 'Человек'
            this.key = 0;
            //веков нету. есть просто расса
            this.here_planet = null;
            this.ava_planet = [
                'https://cdn.discordapp.com/attachments/637613177613451292/648239154240684033/9341a1ab2bb9f3475037b3690165cbbb_ce_615x533x92x0_cropped_800x800.jpg',
                `https://cdn.discordapp.com/attachments/637613177613451292/648239154706120725/downloadfile.png`,
                `https://cdn.discordapp.com/attachments/637613177613451292/648239155423215630/Pluton-640x394.jpg`,
                `https://cdn.discordapp.com/attachments/637613177613451292/648239155423215631/12152747.451981.1367.jpg`,
                `https://cdn.discordapp.com/attachments/637613177613451292/648239156274921493/300px-Oceane.jpg`
            ]
            this.ava = randomElem(this.ava_planet)
            this.history_planet = []
            this.resourse = {
                money:  1000,
                stone:  300,
                wood : 300,
                human: 5,
                idea : 10000,
                food : 1000,
            };//ресурсы независят от планеты
            this.build = {
                miner: {
                    count: 1,
                    price: {
                        wood: 100,
                        stone: 200,
                        money: 250,
                    },
                    STONE_PAY: 100,
                    COAL_PAY: 20,
                },
                lumberjack : {
                    count: 1,
                    price: {
                        wood: 200,
                        stone: 100,
                        money: 250,
                    },
                    WOOD_PAY: 130,
                },
                farm: {
                    count: 1,
                    price: {
                        wood: 100,
                        stone: 50,
                        money: 250,
                    },
                    FOOD_PAY : 50,
                },
                bank : {
                    count: 10,
                    price: {
                        wood: 800,
                        stone: 1000,
                        money: 250,
                    },
                    MONEY_PAY : 50,
                },
                center: {
                    lvl: 1,
                    price: {
                        wood: 2000,
                        stone: 1900,
                        money: 5000,
                    },
                }
            };
            this.race = race;
            this.give_Money = setInterval(() => {
                this.resourse.money += this.build.bank.MONEY_PAY*this.build.bank.count
                this.resourse.stone += this.build.miner.STONE_PAY*this.build.miner.count
                this.resourse.wood +=  this.build.lumberjack.WOOD_PAY*this.build.lumberjack.count
                this.resourse.idea +=  10
                this.resourse.food +=  this.build.farm.FOOD_PAY*this.build.farm.count
            }, 3500);
            this.give_Human = setInterval(() => {
                this.resourse.human += 10
            }, 50000);
            this.nyam_nyam = setInterval(() => {
                if(this.resourse.food <= 0){
                    clearInterval(this.nyam_nyam)
                    console.log(1)
                    sessions[message.author.id] = undefined
                    message.channel.send(`Ваша расса вымерла изза нехватки еды!`)
                    return
                }
                this.resourse.food = this.resourse.food-1*this.resourse.human
            }, 1000);
            class quest_system{
                constructor(){
                    this.quests = require('./quest.json')
                    this.ready = []
                    this.builder= {
                        string_end : [],
                        string_cashe : []
                    }
                    this.readyCreator = (id) => {
                        if(this.quests[id] === undefined)return console.log(id)
                        this.ready[id] = false
                        id++
                        this.readyCreator(id)
                    }
                    this.readyCreator(0)
                }
                checkReady(id){
                    if(this.ready[id] === true)return '☑️'
                    if(this.ready[id] === false)return '❌'
                }
                checkReadyBoolean(id){
                    if(this.ready[id] === true)return true
                    if(this.ready[id] === false)return false
                }
                price(id){
                    return this.quests[id].price
                }
                setReady(id , ready){
                    if(ready !== false && ready !== true)return 'error setReady quest ID: '+id+` ERROR => ${ready}`
                    this.ready[id] = ready
                }
                builderReadyList(id){
                    this.builder.string_end = []
                    this.builder.string_cashe = []
                    while (this.quests[id] !== undefined) {
                        this.builder.string_cashe.push(this.checkReady(id))
                        this.builder.string_cashe.push(this.quests[id].name)
                        console.log(this.builder.string_cashe);
                        this.builder.string_cashe=this.builder.string_cashe.join('')
                        this.builder.string_end.push(this.builder.string_cashe)
                        console.log(this.builder.string_cashe);
                        this.builder.string_cashe = []
                        id++    
                    }
                    if(this.quests[id] === undefined)return this.builder.string_end.join('\n')
                }
            }
            this.quest = new quest_system()
        }
        generatePlanet(name_planet){
            if(name_planet === undefined)name_planet= 'Земля'
            message.channel.send(new Discord.RichEmbed({
                title:'Создаём планету ``'+name_planet+'``'
            }))
            setTimeout(() => {
                this.here_planet = name_planet;
                this.history_planet.push(this.here_planet)
                this.build.miner.count = 1;
                this.build.bank.count = 1;
                this.build.lumberjack.count = 1;
                this.build.farm.count = 1;        
                message.channel.send(new Discord.RichEmbed({
                    title:`Новый дом!`,
                    description:`Название вашей новой планеты: ${this.here_planet}\nВаша раса: **${this.race}**`,
                    fields:[
                        {
                            name: `Ресурсы`,
                            value: `Население: **${this.resourse.human}**един.\nДеньги: **${this.resourse.money}**$\nКамень: **${this.resourse.stone}**един.\nДерево: **${this.resourse.wood}**един.\nЕда: **${this.resourse.food}**един.\nИдеи: **${this.resourse.idea}**`
                        }
                    ],
                    thumbnail: {
                        url:this.ava
                    },
                    color: 0x7dada7
                }))    
            }, 3000);
        }
        giveRes(){
            this.give_Money
            this.give_Human
        }
        buy(tovar ,count){
            if(count === undefined)count = 1
            switch(tovar){
                case'miner':
                    if(this.resourse.wood < this.build.miner.price.wood * count)return message.channel.send('Недостаточно дерева!')
                    if(this.resourse.stone < this.build.miner.price.stone * count)return message.channel.send('Недостаточно камня!')
                    this.build.miner.count += count
                    this.resourse.wood -= this.build.miner.price.wood * count
                    this.resourse.stone -= this.build.miner.price.stone * count
                    this.build.miner.price.wood *= count *2
                    this.build.miner.price.stone *= count *2
                    message.channel.send(`Куплено: ${tovar} ${count}x`)
                break
                case'lumberjack':
                    if(this.resourse.wood < this.build.lumberjack.price.wood * count)return message.channel.send('Недостаточно дерева!')
                    if(this.resourse.stone < this.build.lumberjack.price.stone * count)return message.channel.send('Недостаточно камня!')
                    this.build.lumberjack.count += count
                    this.resourse.wood -= this.build.lumberjack.price.wood * count
                    this.resourse.stone -= this.build.lumberjack.price.stone * count
                    this.build.lumberjack.price.wood *= count * 2
                    this.build.lumberjack.price.stone *= count * 2
                    message.channel.send(`Куплено: ${tovar} ${count}x`)
                break
                case'farm':
                    if(this.resourse.wood < this.build.farm.price.wood * count)return message.channel.send('Недостаточно дерева!')
                    if(this.resourse.stone < this.build.farm.price.stone * count)return message.channel.send('Недостаточно камня!')
                    this.build.farm.count += count
                    this.resourse.wood -= this.build.farm.price.wood * count
                    this.resourse.stone -= this.build.farm.price.stone * count
                    this.build.farm.price.wood *= count * 2
                    this.build.farm.price.stone *= count * 2
                    message.channel.send(`Куплено: ${tovar} ${count}x`)
                break
                case'bank':
                    if(this.resourse.wood < this.build.bank.price.wood * count)return message.channel.send('Недостаточно дерева!')
                    if(this.resourse.stone < this.build.bank.price.stone * count)return message.channel.send('Недостаточно камня!')
                    if(this.resourse.money < this.build.center.price.money * count)return message.channel.send('Недостаточно денег!')
                    this.build.bank.count += count
                    this.resourse.wood -= this.build.bank.price.wood * count
                    this.resourse.stone -= this.build.bank.price.stone * count
                    this.resourse.money -= this.build.bank.price.money * count
                    this.build.bank.price.wood *= count * 2
                    this.build.bank.price.stone *= count * 2
                    this.build.bank.price.money *= count * 2
                    message.channel.send(`Куплено: ${tovar} ${count}x`)
                break
                case'meria':
                    if(this.resourse.wood < this.build.center.price.wood * count)return message.channel.send('Недостаточно дерева!')
                    if(this.resourse.stone < this.build.center.price.stone * count)return message.channel.send('Недостаточно камня!')
                    if(this.resourse.money < this.build.center.price.money * count)return message.channel.send('Недостаточно денег!')
                    this.build.center.lvl += count
                    this.resourse.wood -= this.build.center.price.wood * count
                    this.resourse.stone -= this.build.center.price.stone * count
                    this.resourse.money -= this.build.center.price.money * count
                    this.build.center.price.wood *= count * 2
                    this.build.center.price.stone *= count * 2
                    this.build.center.price.money *= count * 2
                    message.channel.send(`Уровень ${tovar} повышен на **${count}** уровеней`)
                break
                default:
                    message.channel.send('Здание ``'+tovar+'`` нету в списке!')
                break
            }
        }
        info(){
            message.channel.send(new Discord.RichEmbed({
                title: this.here_planet,
                description:`Ваша раса: **${this.race}**`,
                fields:[
                    {
                        name: `Ресурсы`,
                        value: `Население: **${this.resourse.human}**един.\nДеньги: ${this.resourse.money}$\nКамень: **${this.resourse.stone}**един.\nДерево: **${this.resourse.wood}**един.\nЕда: **${this.resourse.food}**един.\nИдеи: **${this.resourse.idea}**`
                    },
                    {
                        name: `Строения`,
                        value: `Шахты: ${this.build.miner.count}шт.\nЛесорубки: ${this.build.lumberjack.count}шт. \n Фермы: ${this.build.farm.count}шт. \n Банки: ${this.build.bank.count}шт.`
                    },
                    {
                        name: `Мерия`,
                        value: `**Текущий уровень : ${this.build.center.lvl}**\n \nМерия увеличивает доходы банка в зависимости от уровня.\nТакже мерия считается показчиком прогресса.`
                    }
                ],
                thumbnail: {
                    url:this.ava
                },
                color: 0x7dada7
            }))
        }
        shop(){
            message.channel.send(new Discord.RichEmbed({
                title: 'Магазин',
                description:'Строения\n'+`Ваши ресурсы: \n🔹 Дерево: **${this.resourse.wood}**един. \n 🔹 Камень: **${this.resourse.stone}**един.\n 🔹 Деньги: **${this.resourse.money}**$`,
                fields:[
                    {
                        name: `Шахта - G:buy miner`,
                        value: `Стоит: \n 🔸 Дерево: **${this.build.miner.price.wood}**един. \n🔸 Камень: **${this.build.miner.price.stone}**един. \n \nДаёт камень и уголь - необходимые вещи для работы и строительства`,
                    },
                    {
                        name: `Лесорубка - G:buy lumberjack`,
                        value: `Стоит: \n 🔸 Дерево: **${this.build.lumberjack.price.wood}**един. \n🔸 Камень: **${this.build.lumberjack.price.stone}**един. \n \nДаёт дерево необходимое для строительства`,
                    },
                    {
                        name: `Ферма - G:buy farm`,
                        value: `Стоит: \n 🔸 Дерево: **${this.build.farm.price.wood}**един. \n🔸 Камень: **${this.build.farm.price.stone}**един. \n \nДаёт еду необходимую для жителей`,
                    },
                    {
                        name: `Банк - G:buy bank`,
                        value: `Стоит: \n 🔸 Дерево: **${this.build.bank.price.wood}**един. \n🔸 Камень: **${this.build.bank.price.stone}**един.\n🔸 Деньги: **${this.build.bank.price.money}**$ \n \nДаёт деньги`,
                    },
                    {
                        name: `Повысить уровень мэрии - G:buy meria`,
                        value: `Стоит: \n 🔸 Дерево: **${this.build.center.price.wood}**един. \n🔸 Камень: **${this.build.center.price.stone}**един.\n🔸 Деньги: **${this.build.center.price.money}**$`,
                    }
                ],
                footer:{
                    text:`-.-`
                }
            }))
        }
    }
    var args = message.content.split(" ")
    
    switch(args[0]){
        case prefix+"help":
            message.channel.send(new Discord.RichEmbed({
                title: "Помощь по игре",
                description: '**Список команд и описание**',
                fields:[
                    {
                        name: 'G:start & <название планеты> & <раса>',
                        value:'Начать игру создав свою расу и планету\nОбязательно укажите ``&`` или команда неправильно сработает'
                    },
                    {
                        name: 'G:exit',
                        value:'Закончить игру'
                    },
                    {
                        name: 'G:info',
                        value:'Обновить информацию о планете'
                    },
                    {
                        name: 'G:shop',
                        value:'Магазин строений , юнитов , и внутриигровых предметов'
                    },
                    {
                        name: 'G:buy <товар> [количество]',
                        value:'Купить товар в указаном количестве.\nНеуказано = 1х'
                    },
                    {
                        name: 'G:report <описание ошибки>',
                        value:'Отправить репорт об ошибке'
                    },
                    {
                        name: 'Дальше - больше!',
                        value:'Дальше будет больше команд и плюшек!'
                    },
                ],
                footer: client.user.avatarURL + client.user.username
            }))
            message.channel.send(new Discord.RichEmbed({
                title:'Советы',
                description:`Ниже наведены *советы*`,
                fields:[
                    {
                        name:'1. Население кушает!',
                        value: 'Еда - важный элемент в игре. Она нужна для питания населения\nВ протяжении игры независимо от вас растёт количество насаления а в следствии возрастает потребность еды\nСтройте фермы для получения еды.'
                    },
                    {
                        name:'2. Ресурсы',
                        value: 'Ресурсы нужны для строительства. В начале игры вам дают стартовое количество ресурсов\nчтобы вы смогли развится. Здания для добычи можно построить. Подробнее в ``G:shop``'
                    },
                    {
                        name:'3. Цены',
                        value: 'Внимательно смотри на цены зданий! Ибо может быть что тебе не хватит ресурсов для построки важного здания!'
                    },
                    {
                        name:'4. Оставляйте репорт если нашли ошибку',
                        value: 'Если вы нашли ошибку в игре то оставьте нам пожалуйста репорт об ошибке\n подробно описав что вы делали с начала игры (если помните). \n``G:report <описание ошибки>``'
                    }
                ]
            }))
        break
        case prefix+"start":
            var splited = message.content.split("&")
            sessions[message.author.id] = new session(splited[2])
            session_here = sessions[message.author.id]
            session_here.key = 1;
            session_here.generatePlanet(splited[1])
            session_here.giveRes();
        break
        case prefix+"shop":
            if(sessions[message.author.id] === undefined)return message.channel.send('Начни играть!')
            session_here.shop();
        break
        case prefix+"exit":
            if(sessions[message.author.id] === undefined)return message.channel.send('Начни играть!')
            message.channel.send(new Discord.RichEmbed({
                title:'Вы вышли с игры',
                description:`Ваша планета: **${session_here.here_planet}**\nВаша раса: **${session_here.race}** \nВаш уровень мэрии: *${session_here.build.center.lvl}* уровень`,
                thumbnail:{
                    url: session_here.ava
                }
            }))
            sessions[message.author.id] = undefined
        break
        case prefix+"report":
            var splited = message.content.split(' ')
            var pathSendGuild = message.guild.name + `.`
            if(pathSendGuild === undefined)pathSendGuild = ''
            var invite = message.channel.fetchInvites(message.channel.createInvite())
            if(invite === undefined)invite = ''
            splited.shift()
            splited = splited.join(" ")
            client.fetchUser(`391549863185219585`).then(user =>{user.send(new Discord.RichEmbed({
                title: `Репорт о ошибке от ${message.author.tag}`,
                fields:[
                    {
                        name:`Автор бот? : ${message.author.bot}\nТип канала: ${message.channel.type}\nМесто отправки: ${pathSendGuild}${message.channel.name}\nСодержание:`,
                        value:`\n`+splited
                    }
                ],
                footer:{
                    text:`ID: ${message.author.id} | Время отправки: ${message.createdAt}`
                }
            }))})
            console.log(message.channel.createInvite())
            message.channel.send(new Discord.RichEmbed({
                title:`Репорт отправлен!`,
                description:`Ошибка рано или позно будет устранена!`
            }))
        break
        case prefix+"info":
            if(sessions[message.author.id] === undefined)return message.channel.send('Начни играть!')
            session_here.info();
        break
        case prefix+"buy":
            if(sessions[message.author.id] === undefined)return message.channel.send('Начни играть!')
            session_here.buy(args[1], args[2]);
        break
        case prefix+"rocket":
            if(sessions[message.author.id] === undefined)return message.channel.send('Начни играть!')
            if(sessions[message.author.id].quest.ready[0] === false) message.channel.send('Для смены планеты нужно выполнить квест "Собрать ракету"(1)!')
            sessions[message.author.id].generatePlanet(sessions[message.author.id].here_planet)
        break
        case prefix+"exit":
            if(sessions[message.author.id] === undefined)return message.channel.send('Начни играть!')
            sessions[message.author.id] = undefined
        break
        case prefix+"history":
            if(sessions[message.author.id] === undefined)return message.channel.send('Начни играть!')
            message.channel.send('История планет: \n``'+sessions[message.author.id].history_planet.join("\n")+'``')
        break
        case prefix+"quest":
            if(sessions[message.author.id] === undefined)return message.channel.send('Начни играть!')
            if(args[1] === undefined)return message.channel.send(new Discord.RichEmbed({
                title:'Квесты',
                description: 'Выполняй квесты по игре и получай некоторые возмжности',
                fields:[
                    {
                        name:'Список квестов',
                        value: sessions[message.author.id].quest.builderReadyList(0)
                    }
                ]
            }))
            if(args[1]=== '1') args[1]= '0'
            args[1] = parseInt(args[1],10)
            if(sessions[message.author.id].resourse.idea < sessions[message.author.id].quest.quests[args[1]].price)return message.channel.send(`Недостаточно ${sessions[message.author.id].quest.quests[args[1]].price-sessions[message.author.id].resourse.idea}  идей`)
            sessions[message.author.id].resourse.idea =- sessions[message.author.id].quest.quests[args[1]].price
            sessions[message.author.id].quest.ready[args] = true
        break
    }
})
client.login(`¯\_(ツ)_/¯`)