var M_WIDTH=450, M_HEIGHT=800;
var app, game_res, objects={}, game_tick=0, my_data ={};
var some_process = {};

irnd = function(min,max) {	
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class card_class extends PIXI.Container {
	
	constructor(x,y,w,h) {
		
		super();
		this.visible=false;
		this.pic = new PIXI.Sprite(gres.pic1.texture);	
		this.pic.width = w; this.pic.height = h;

		this.pic_mask = new PIXI.Sprite(gres.card_mask.texture);	
		this.pic.mask = this.pic_mask;	
		this.pic_frame = new PIXI.Sprite(gres.card_frame.texture);		
		this.title = new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 35,align: 'center'});
		this.title.anchor.set(0.5,0.5);
		this.title.text = 'Совет тебе на сегодня';
		this.title.x = 225;
		this.title.y = 300;
		this.title.maxWidth = 350;
		//this.width = w;
		//this.height = h;
		
		this.interactive = true;
		this.buttonMode = true;
		this.addChild (this.pic, this.pic_mask, this.pic_frame, this.title)

		
	}		
	
	pointerdown() {

		vkBridge.send("VKWebAppShowWallPostBox", {
		  "message": "Hello!",
		  "attachments": "photo39099558_358381926"
		});
	}
	
	
}

var get_server = async function() {
	
	access_token  = await Bridge.send("VKWebAppGetAuthToken", { app_id: 8209158, scope: "photos" })
	console.log(access_token);
	
	 response = await vkBridge.send('VKWebAppCallAPIMethod', {
        method: 'photos.createAlbum',
        params: {
			v: '5.131',
			title : 'Кто Я'
			access_token: 'vk1.a.ysPasWWdzSI9a1usy249ohaT5k31SoCC9gouyqDnDvHNq18PEH8anWN4gnSfGvkHCa7VA3wA86uleec_xSoj_D-F_GcSKO7qZEHCB3KrnU9scBOkkzCth48eSkHzwf4qhkkQMkYlnybKZ592cZMNh5O_rwktOS2njCKBinkN_IZuAocjnifl5P6jVLmKsolE'
		},
      })
	
	 response = await vkBridge.send('VKWebAppCallAPIMethod', {
        method: 'photos.getAlbums',
        params: {
			v: '5.131',
			access_token: 'vk1.a.ysPasWWdzSI9a1usy249ohaT5k31SoCC9gouyqDnDvHNq18PEH8anWN4gnSfGvkHCa7VA3wA86uleec_xSoj_D-F_GcSKO7qZEHCB3KrnU9scBOkkzCth48eSkHzwf4qhkkQMkYlnybKZ592cZMNh5O_rwktOS2njCKBinkN_IZuAocjnifl5P6jVLmKsolE'
		},
      })
	  
	  console.log(response)
	
	
	 response = await vkBridge.send('VKWebAppCallAPIMethod', {
        method: 'photos.getUploadServer',
        params: {
			v: '5.131',
		},
      })
	  
	  console.log(response)
	
	
}
	
	
var anim2 = {
		
	c1: 1.70158,
	c2: 1.70158 * 1.525,
	c3: 1.70158 + 1,
	c4: (2 * Math.PI) / 3,
	c5: (2 * Math.PI) / 4.5,
		
	slot: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
	
	any_on : function() {
		
		for (let s of this.slot)
			if (s !== null)
				return true
		return false;		
	},
	
	linear: function(x) {
		return x
	},
	
	kill_anim: function(obj) {
		
		for (var i=0;i<this.slot.length;i++)
			if (this.slot[i]!==null)
				if (this.slot[i].obj===obj)
					this.slot[i]=null;		
	},
	
	easeOutBack: function(x) {
		return 1 + this.c3 * Math.pow(x - 1, 3) + this.c1 * Math.pow(x - 1, 2);
	},
	
	easeOutElastic: function(x) {
		return x === 0
			? 0
			: x === 1
			? 1
			: Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * this.c4) + 1;
	},
	
	easeOutSine: function(x) {
		return Math.sin( x * Math.PI * 0.5);
	},
	
	easeOutCubic: function(x) {
		return 1 - Math.pow(1 - x, 3);
	},
	
	easeInBack: function(x) {
		return this.c3 * x * x * x - this.c1 * x * x;
	},
	
	easeInQuad: function(x) {
		return x * x;
	},
	
	easeOutBounce: function(x) {
		const n1 = 7.5625;
		const d1 = 2.75;

		if (x < 1 / d1) {
			return n1 * x * x;
		} else if (x < 2 / d1) {
			return n1 * (x -= 1.5 / d1) * x + 0.75;
		} else if (x < 2.5 / d1) {
			return n1 * (x -= 2.25 / d1) * x + 0.9375;
		} else {
			return n1 * (x -= 2.625 / d1) * x + 0.984375;
		}
	},
	
	easeInCubic: function(x) {
		return x * x * x;
	},
	
	ease2back : function(x) {
		return Math.sin(x*Math.PI);
	},
	
	easeInOutCubic: function(x) {
		return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
	},
	
	add : function(obj, params, vis_on_end, time, func, anim3_origin) {
				
		//если уже идет анимация данного спрайта то отменяем ее
		anim2.kill_anim(obj);
		/*if (anim3_origin === undefined)
			anim3.kill_anim(obj);*/


		let f=0;
		//ищем свободный слот для анимации
		for (var i = 0; i < this.slot.length; i++) {

			if (this.slot[i] === null) {

				obj.visible = true;
				obj.ready = false;

				//добавляем дельту к параметрам и устанавливаем начальное положение
				for (let key in params) {
					params[key][2]=params[key][1]-params[key][0];					
					obj[key]=params[key][0];
				}
				
				//для возвратных функцие конечное значение равно начальному
				if (func === 'ease2back')
					for (let key in params)
						params[key][1]=params[key][0];					

					

				this.slot[i] = {
					obj: obj,
					params: params,
					vis_on_end: vis_on_end,
					func: this[func].bind(anim2),
					speed: 0.01818 / time,
					progress: 0
				};
				f = 1;
				break;
			}
		}
		
		if (f===0) {
			console.log("Кончились слоты анимации");	
			
			
			//сразу записываем конечные параметры анимации
			for (let key in params)				
				obj[key]=params[key][1];			
			obj.visible=vis_on_end;
			obj.alpha = 1;
			obj.ready=true;
			
			
			return new Promise(function(resolve, reject){					
			  resolve();	  		  
			});	
		}
		else {
			return new Promise(function(resolve, reject){					
			  anim2.slot[i].p_resolve = resolve;	  		  
			});			
			
		}

		
		

	},	
	
	process: function () {
		
		for (var i = 0; i < this.slot.length; i++)
		{
			if (this.slot[i] !== null) {
				
				let s=this.slot[i];
				
				s.progress+=s.speed;				
				for (let key in s.params)				
					s.obj[key]=s.params[key][0]+s.params[key][2]*s.func(s.progress);		

				
				//если анимация завершилась то удаляем слот
				if (s.progress>=0.999) {
					for (let key in s.params)				
						s.obj[key]=s.params[key][1];
					
					s.obj.visible=s.vis_on_end;
					if (s.vis_on_end === false)
						s.obj.alpha = 1;
					
					s.obj.ready=true;					
					s.p_resolve('finished');
					this.slot[i] = null;
				}
			}			
		}
		
	}
	
}

var sound = {
	
	on : 1,
	
	play : function(snd_res) {
		
		if (this.on === 0)
			return;
		
		if (game_res.resources[snd_res]===undefined)
			return;
		
		game_res.resources[snd_res].sound.play();	
		
	}
	
	
}

var message =  {
	
	promise_resolve :0,
	
	add : async function(text) {
		
		if (this.promise_resolve!==0)
			this.promise_resolve("forced");
		
		//воспроизводим звук
		sound.play('message');

		objects.message_text.text=text;

		await anim2.add(objects.message_cont,{x:[-200,objects.message_cont.sx]}, true, 0.5,'easeOutBack');

		let res = await new Promise((resolve, reject) => {
				message.promise_resolve = resolve;
				setTimeout(resolve, 3000)
			}
		);
		
		if (res === "forced")
			return;

		anim2.add(objects.message_cont,{x:[objects.message_cont.sx, -200]}, false, 0.5,'easeInBack');			
	}

}

var big_message = {
	
	p_resolve : 0,
		
	show: function(t1,t2) {
				
		if (t2!==undefined || t2!=="")
			objects.big_message_text2.text=t2;
		else
			objects.big_message_text2.text='**********';

		objects.big_message_text.text=t1;
		anim2.add(objects.big_message_cont,{y:[-180,objects.big_message_cont.sy]}, true, 0.6,'easeOutBack');		
				
		return new Promise(function(resolve, reject){					
			big_message.p_resolve = resolve;	  		  
		});
	},

	close : function() {
		
		if (objects.big_message_cont.ready===false)
			return;

		anim2.add(objects.big_message_cont,{y:[objects.big_message_cont.sy,450]}, false, 0.4,'easeInBack');		
		this.p_resolve("close");			
	}

}

var make_text = function (obj, text, max_width) {

	let sum_v=0;
	let f_size=obj.fontSize;

	for (let i=0;i<text.length;i++) {

		let code_id=text.charCodeAt(i);
		let char_obj=game_res.resources.m2_font.bitmapFont.chars[code_id];
		if (char_obj===undefined) {
			char_obj=game_res.resources.m2_font.bitmapFont.chars[83];
			text = text.substring(0, i) + 'S' + text.substring(i + 1);
		}

		sum_v+=char_obj.xAdvance*f_size/64;
		if (sum_v>max_width) {
			obj.text =  text.substring(0,i-1);
			return;
		}
	}

	obj.text =  text;
}

var game = {

	opponent : "",
	selected_checker : 0,
	motion_finished : 1,
	move_finished : function(){},
	checker_move_func : function(){},
	mx : 0,
	my : 0,
	guide_drag : 0,

	activate: async function(opponent, role) {
		
		
		let my_tex, opp_tex;
		if (role==="master") {
			objects.timer_cont.x=10;
			my_turn=1;		
			my_tex = 'red_checker';
			opp_tex = 'white_checker';
			message.add(['Ваш ход','Your turn'][LANG])
			
		} else {
			objects.timer_cont.x=610;
			my_turn=0;
			my_tex = 'white_checker';
			opp_tex = 'red_checker';
			message.add(['Ход соперника','Opponents move'][LANG])
		}
				
				
		//играем звук
		sound.play('note');
				
		if (lb.active === 1) lb.close();		
		if (pref.active === 1) pref.close();		
		if (rules.active === 1) rules.close();	
				
		//инициируем параметры шашек
		objects.checkers.forEach(c =>{			
			c.speed = 0;
			c.dx=0;
			c.dy=0;
			c.visible = false;	
		});		
				
		//размещаем мои шашки на доске в соответствиии с настойками
		for (let [i, p] of Object.entries(pref.b_conf)) {
			i*=1;
			objects.checkers[i].x = objects.board.sx + 25 + 10 + p[1]*50;
			objects.checkers[i].y = objects.board.sy + 25 + 10 + p[0]*50;			
			objects.checkers[i].m = p[2];	
			objects.checkers[i].bcg.texture=gres[my_tex + p[2]].texture;			
			objects.checkers[i].visible = true;			
		}
				
		//перенаправляем события нажатия сюда
		objects.checkers.forEach(c => {			
			c.pointerdown = game.checker_down.bind(game, c);		
		})


		//основные элементы игры
		objects.desktop.visible = false;
		objects.board.visible=true;
		objects.my_card_cont.visible=true;
		objects.opp_card_cont.visible=true;
		objects.timer_cont.visible=true;
		
		if (this.opponent !== "")
			this.opponent.clear();
		
		//активируем оппонента
		this.opponent = opponent;
		await this.opponent.activate(opp_tex);	
		
		//подтверждение игры
		me_conf_play = 0;
		opp_conf_play = 0;
				
		//процессинговая функция
		some_process.main_process = this.process.bind(game);

		my_role = role;

		//если открыт лидерборд то закрываем его
		if (objects.lb_1_cont.visible===true)
			lb.close();
			
		

		//это если перешли из бот игры
		this.selected_checker=-1;
		

		//обозначаем какой сейчас ход
		made_moves=0;

		app.stage.interactive = true;
		app.stage.pointerup = this.pointer_up_on_stage.bind(this);
		app.stage.pointermove = this.pointermove.bind(this);
				
		//включаем взаимодейтсвие с доской
		objects.board.pointerdown = game.pointer_down_on_board.bind(game);
	},
	
	pointermove : function(e) {
		
		this.mx = r2(e.data.global.x/app.stage.scale.x);
		this.my = r2(e.data.global.y/app.stage.scale.y);

	},
	
	process : function() {
			
		
		if (this.guide_drag === 1) {
						
			objects.guide_point.x = r2(this.mx - objects.guide_point.shift_x);
			objects.guide_point.y = r2(this.my - objects.guide_point.shift_y);
					
			
			let dx = r2(objects.guide_point.x - this.selected_checker.x);
			let dy = r2(objects.guide_point.y - this.selected_checker.y);
			let d = r2(Math.sqrt(dx*dx + dy*dy));
			
			objects.guide_power.x = r2(this.mx - objects.guide_point.shift_x - 50);
			objects.guide_power.y = r2(this.my - objects.guide_point.shift_y);	
			objects.guide_power.power = r2(Math.min(d,145)/1.45);
			objects.guide_power.text = ~~(objects.guide_power.power) +'%'

			objects.guide_line.rotation = r2(Math.atan2(dy, dx));
		
		}
		
		this.checker_move_func();
			
			
		//анимация мин
		for(let i = 32 ; i < 40 ; i++)
			if (objects.checkers[i].visible === true)
				objects.checkers[i].rotation = Math.sin(game_tick );


	},
	
	add_boom(x,y) {
		
		for(let b of objects.booms) {
			if (b.visible === false) {
				b.x = x;
				b.y = y;
				anim2.add(b,{alpha:[1, 0],scale_xy:[0.5,1.5]}, false, 0.7,'linear');	
				return;				
			}			
		}
		
	},
	
	timer_tick: function() {



	},
	
	pointer_up_on_stage : function (e) {
				
		
	},
	
	guide_point_down: function (e) {
		
		this.mx = e.data.global.x/app.stage.scale.x;
		this.my = e.data.global.y/app.stage.scale.y;
		
		//вычисляем сдвиг относительно центра
		objects.guide_point.shift_x = this.mx - objects.guide_point.x;
		objects.guide_point.shift_y = this.my - objects.guide_point.y;
		
		this.guide_drag = 1;		
		
	},
	
	guide_point_up: function () {
		
		this.guide_drag = 0;		
	},

	pointer_down_on_board : function(e) {



	},
	
	checker_down : function(c, e) {
		
		if (objects.big_message_cont.visible === true)
			return;
		
		if (c.id < 16) {			
			message.add(['Это не ваши шашки','Not your checkers'][LANG]);
			return;
		}
		
		if (c.id > 31) {			
			message.add(['Это мина','That is mine'][LANG]);
			return;
		}
		
		if (my_turn === 0) {			
			message.add(['Не твоя очередь','Not your turn'][LANG]);
			return;
		}	
		
		//звук
		sound.play('sel_chk_sound');
		
		this.selected_checker = c;
		objects.sel_chk.x = c.x;
		objects.sel_chk.y = c.y;
		objects.sel_chk.visible = true;
		anim2.add(objects.scb_cont,{x:[900,objects.scb_cont.sx]}, true, 0.5,'easeOutBack');
		
		objects.guide_line.x = c.x;
		objects.guide_line.y = c.y;
		
		if (c.y > 224)
			objects.guide_line.rotation = - r2(Math.PI / 2);
		else
			objects.guide_line.rotation =  r2(Math.PI / 2);
		
		//стрелка направления
		objects.guide_line.visible = true;
		
		//точка управления направлением
		objects.guide_point.x = r2(c.x + Math.cos(objects.guide_line.rotation)*145);
		objects.guide_point.y = r2(c.y + Math.sin(objects.guide_line.rotation)*145);
		objects.guide_point.visible = true;
		
		
		//Надпись о мощности удара
		objects.guide_power.visible = true;
		objects.guide_power.power = 100;
		objects.guide_power.x = r2(objects.guide_point.x - 50);
		objects.guide_power.y = objects.guide_point.y;
		
	},
		
	process_sending_move : function() {
			
		//обрабатываем движение и возвращаем указатель завершения
		this.motion_finished = board_func.update_motion(objects.checkers, 1);
				
		//проверяем столкновения шашек
		board_func.update_collisions(objects.checkers, 0, 1);	
				
		//если движение завершено завершаем промис движения
		if (this.motion_finished === 1)	this.move_finished();			
		
	},
	
	process_receiving_move : function() {
			
		//обрабатываем движение и возвращаем указатель завершения
		this.motion_finished = board_func.update_motion(objects.checkers, 1);
			
		//проверяем столкновения шашек
		board_func.update_collisions(objects.checkers, 1, 1);		
		
		//когда движение завершено завершаем промис движения
		if (this.motion_finished === 1)	this.move_finished();			
		
	},
	
	add_mine : function(_mine_pos) {
		
		let mine_pos;
		
		if (_mine_pos === undefined)
			mine_pos = board_func.get_free_point(objects.checkers);
		else
			mine_pos =_mine_pos;
		
		for (let i = 32 ; i < 40 ; i++) {
			let c = objects.checkers[i];
			if (c.visible === false) {
				
				c.x = mine_pos[0];
				c.y = mine_pos[1];
				c.bcg.texture = gres.mine.texture;	
				anim2.add(c,{alpha:[0, 1]}, true, 0.5,'linear');	
				return mine_pos;
			}
			
		}
		
		return -1;	
		
	},
	
	send_checker : async function() {
						
						
		if (objects.big_message_cont.visible === true) return;
		if (objects.scb_cont.ready === false) return;			
						
		//задаем направление шашке в соответствии с настойками указателя
		let dx = r2(Math.cos(objects.guide_line.rotation)*objects.guide_power.power * 0.3);
		let dy = r2(Math.sin(objects.guide_line.rotation)*objects.guide_power.power * 0.3);
		this.selected_checker.dx = dx;
		this.selected_checker.dy = dy;
		
		//звук
		sound.play('send_chk');
		
		//меняем очередь
		my_turn = 0;
				
		//я подтвердил начало игры
		me_conf_play = 1;
		
		this.opponent.reset_timer();
			
		//убираем указатели
		objects.guide_line.visible = false;
		objects.guide_point.visible = false;
		objects.sel_chk.visible = false;
		objects.guide_power.visible = false;		
		
		//убираем кнопку отправки шашки
		anim2.add(objects.scb_cont,{x:[objects.scb_cont.x,900]}, false, 0.5,'easeInBack');		
						
		//ждем завершения движения шашки
		this.checker_move_func = this.process_sending_move;
		await new Promise(function(resolve, reject){game.move_finished = resolve});	
		this.checker_move_func = function() {};
		
		
		//board_func.print(objects.checkers,0);
		
		//размещаем мину
		let mine_pos = -1;
		if (my_role === 'slave') {			
			let num_of_mines = board_func.get_num_of_mines(objects.checkers);
			if (num_of_mines < 3)
				mine_pos = this.add_mine();					
		}
		
		//отправляем оппоненту информацию о ходе
		this.opponent.send_move({cid : this.selected_checker.id, dx : dx, dy : dy, mine_pos : mine_pos});	
		
		this.selected_checker = -1;	

		//проверяем завершение игры если я слейв
		if (my_role === 'slave') made_moves++;
				
		this.check_game_end();				
		
	},	
	
	check_game_end : function () {
		
		//получаем сколько осталось шашек
		[my_checkers_left, opp_checkers_left] = board_func.get_checkers_left(objects.checkers);
			
		console.log('Проверка завершения',my_checkers_left, opp_checkers_left)
		
		if (my_checkers_left===0 && opp_checkers_left===0) {
			game.stop('no_checkers_left');
			return;
		}
			
		if (my_checkers_left>0 && opp_checkers_left===0) {
			game.stop('only_my_left');
			return;
		}
		
		if (my_checkers_left===0 && opp_checkers_left>0) {
			game.stop('only_opp_left');
			return;
		}
	},
	
	get_checker_by_pos : function(x,y) {
				
		for (let c of objects.checkers) {
			let dx = c.x - x;
			let dy = c.y - y;
			let d = Math.sqrt(dx*dx+dy*dy);
			if (d<25)
				return c;
			
		}

		return 0;		
	},

	print_board : function(inv) {
		
		return;
		if (inv === 1) {
			
			pref.b_conf.forEach((c,i) => {
				if (objects.checkers[i].visible === true)	console.log(i,objects.checkers[i].x,objects.checkers[i].y);
			})
			
			opp_data.b_conf.forEach((c,i) => {
				if (objects.checkers[i+16].visible === true)	console.log(i,objects.checkers[i+16].x,objects.checkers[i+16].y);
			})			
			
			
			
		} else {
			
			pref.b_conf.forEach((c,i) => {
				if (objects.checkers[i].visible === true)	console.log(i,objects.checkers[i].x,objects.checkers[i].y);
			})
			
			opp_data.b_conf.forEach((c,i) => {
				if (objects.checkers[i+16].visible === true)	console.log(i,objects.checkers[i+16].x,objects.checkers[i+16].y);
			})
			
		}

		
		
	},

	receive_move: async function(move_data) {
		
		let checker_id = 31 - move_data.cid;
		
		//переворачиваем направления
		let dx = - move_data.dx;
		let dy = - move_data.dy;
				
		//задаем направления соответствующей шашке
		objects.checkers[checker_id].dx = dx;
		objects.checkers[checker_id].dy = dy;
		
		//оппонент подтвердил игру
		opp_conf_play = 1;
		
		//звук
		sound.play('send_chk');
		
		//ждем завершения движения шашки
		this.checker_move_func = this.process_receiving_move;
		await new Promise(function(resolve, reject){game.move_finished = resolve});	
		
		//проверяем сообщение о мине, координаты переворачиваем
		if (my_role === 'master' && move_data.mine_pos!==undefined && move_data.mine_pos!==-1)
			this.add_mine([800 - move_data.mine_pos[0], 440 - move_data.mine_pos[1]])
		
		my_turn = 1;
		this.opponent.reset_timer();
		
		//проверяем завершение игры если я мастер
		if (my_role === 'master') {
			made_moves++;					
		}
		
		this.check_game_end();	

	},
	
	stop : async function (result) {
				
		
		//останавливаем музыку
		gres.music.sound.stop();
		
		//процессинговая функция
		some_process.main_process = function(){};	
				
		await this.opponent.stop(result);
				
		objects.scb_cont.visible = false;
		objects.giveup_dialog.visible=false;
		objects.board.visible=false;
		objects.opp_card_cont.visible=false;
		objects.my_card_cont.visible=false;
		objects.checkers.forEach((c)=> {c.visible=false});
		
		objects.sel_chk.visible = false;
		objects.guide_line.visible = false;
		objects.guide_point.visible =false;
		objects.guide_power.visible =false;
		
		//рекламная пауза
		show_ad();
		await new Promise((resolve, reject) => setTimeout(resolve, 2000));
		
		//показыаем основное меню
		main_menu.activate();

		//стираем данные оппонента
		opp_data.uid="";
		
		//соперника больше нет
		this.opponent = "";
		
		//показываем социальную панель
		if (game_platform === 'VK')
			social_dialog.show();	

		//устанавливаем статус в базе данных а если мы не видны то установливаем только скрытое состояние
		set_state ({state : 'o'});
	}

}

var	show_ad = async function(){
		
	if (game_platform==="YANDEX") {			
		try {
			await new Promise((resolve, reject) => {			
				window.ysdk.adv.showFullscreenAdv({  callbacks: {onClose: function() {resolve()}, onError: function() {resolve()}}});			
			});				
			
		} catch (e) {
			
			console.error(e);
		}
	}
	
	if (game_platform==="VK") {
				 
		try {
			await vkBridge.send("VKWebAppShowNativeAds", {ad_format:"interstitial"});			
		} catch (e) {			
			console.error(e);
		}		
	}		

	if (game_platform==="CRAZYGAMES") {
				 
		try {
			const crazysdk = window.CrazyGames.CrazySDK.getInstance();
			crazysdk.init();
			crazysdk.requestAd('midgame');		
		} catch (e) {			
			console.error(e);
		}
	}		

}

var keep_alive= function() {
	
	if (h_state === 1) {		
		
		//убираем из списка если прошло время с момента перехода в скрытое состояние		
		let cur_ts = Date.now();	
		let sec_passed = (cur_ts - hidden_state_start)/1000;		
		if ( sec_passed > 100 )	firebase.database().ref(room_name+"/"+my_data.uid).remove();
		return;		
	}


	firebase.database().ref("players/"+my_data.uid+"/tm").set(firebase.database.ServerValue.TIMESTAMP);
	firebase.database().ref("inbox/"+my_data.uid).onDisconnect().remove();
	firebase.database().ref(room_name+"/"+my_data.uid).onDisconnect().remove();

	set_state({});
}

var process_new_message=function(msg) {

	//проверяем плохие сообщения
	if (msg===null || msg===undefined)
		return;

	//принимаем только положительный ответ от соответствующего соперника и начинаем игру
	if (msg.message==="ACCEPT"  && pending_player===msg.sender && state !== "p") {
		//в данном случае я мастер и хожу вторым
		opp_data.uid=msg.sender;
		game_id=msg.game_id;
		cards_menu.accepted_invite();
	}

	//принимаем также отрицательный ответ от соответствующего соперника
	if (msg.message==="REJECT"  && pending_player === msg.sender) {
		cards_menu.rejected_invite();
	}

	//получение сообщение в состояни игры
	if (state==="p") {

		//учитываем только сообщения от соперника
		if (msg.sender===opp_data.uid) {

			//получение отказа от игры
			if (msg.message==="REFUSE")
				confirm_dialog.opponent_confirm_play(0);

			//получение согласия на игру
			if (msg.message==="CONF")
				confirm_dialog.opponent_confirm_play(1);

			//получение стикера
			if (msg.message==="MSG")
				stickers.receive(msg.data);

			//получение сообщение с сдаче
			if (msg.message==="END" )
				game.stop('opp_giveup');

			//получение сообщение с ходом игорка
			if (msg.message==="MOVE")
				game.receive_move(msg.data);
		}
	}

	//приглашение поиграть
	if(state==="o" || state==="b") {
		if (msg.message==="INV") {
			req_dialog.show(msg.sender);
		}
		if (msg.message==="INV_REM") {
			//запрос игры обновляет данные оппонента поэтому отказ обрабатываем только от актуального запроса
			if (msg.sender === req_dialog._opp_data.uid)
				req_dialog.hide(msg.sender);
		}
	}

}

var auth = function() {
	
	return new Promise((resolve, reject)=>{

		let help_obj = {

			loadScript : function(src) {
			  return new Promise((resolve, reject) => {
				const script = document.createElement('script')
				script.type = 'text/javascript'
				script.onload = resolve
				script.onerror = reject
				script.src = src
				document.head.appendChild(script)
			  })
			},

			init: async function() {


				let s = window.location.href;

				//-----------ЯНДЕКС------------------------------------
				if (s.includes("yandex")) {
					game_platform="YANDEX";
					try {
						await this.loadScript('https://yandex.ru/games/sdk/v2')						
					} catch (e) {
						alert(e);
					}
					help_obj.yandex();
					return;
				}

				//-----------CRAZYGAMES------------------------------------
				if (s.includes("crazygames")) {
					game_platform="CRAZYGAMES";					
					try {
						await this.loadScript('https://sdk.crazygames.com/crazygames-sdk-v1.js')					
					} catch (e) {
						alert(e);
					}
					help_obj.crazygames();										
					return;
				}
				
				
				//-----------ВКОНТАКТЕ------------------------------------
				if (s.includes("vk.com")) {
					game_platform="VK";
					
					try {
						await this.loadScript('https://unpkg.com/@vkontakte/vk-bridge/dist/browser.min.js')				
					} catch (e) {
						alert(e);
					}
					help_obj.vk()					
					return;
				}


				//-----------ЛОКАЛЬНЫЙ СЕРВЕР--------------------------------
				if (s.includes("192.168")) {
					game_platform="debug";
					help_obj.debug();
					return;
				}


				//-----------НЕИЗВЕСТНОЕ ОКРУЖЕНИЕ---------------------------
				game_platform="unknown";
				help_obj.unknown();

			},

			get_random_name : function(e_str) {
				
				let rnd_names = ['Gamma','Жираф','Зебра','Тигр','Ослик','Мамонт','Волк','Лиса','Мышь','Сова','Hot','Енот','Кролик','Бизон','Super','ZigZag','Magik','Alpha','Beta','Foxy','Fazer','King','Kid','Rock'];
				let chars = '+0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
				if (e_str !== undefined) {
					
					let e_num1 = chars.indexOf(e_str[0]) + chars.indexOf(e_str[1]) + chars.indexOf(e_str[2]) +	chars.indexOf(e_str[3]);
					e_num1 = Math.abs(e_num1) % (rnd_names.length - 1);					
					let e_num2 = chars.indexOf(e_str[4]).toString()  + chars.indexOf(e_str[5]).toString()  + chars.indexOf(e_str[6]).toString() ;	
					e_num2 = e_num2.substring(0, 3);
					return rnd_names[e_num1] + e_num2;					
					
				} else {

					let rnd_num = irnd(0, rnd_names.length - 1);
					let rand_uid = irnd(0, 999999)+ 100;
					let name_postfix = rand_uid.toString().substring(0, 3);
					let name =	rnd_names[rnd_num] + name_postfix;				
					return name;
				}							

			},	

			get_random_name2 : function(e_str) {
				
				let rnd_names = ['Crazy','Monkey','Sky','Mad','Doom','Hash','Sway','Ace','Thor'];
				let chars = '+0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
				if (e_str !== undefined) {
					
					let e_num1 = chars.indexOf(e_str[0]) + chars.indexOf(e_str[1]) + chars.indexOf(e_str[2]) +	chars.indexOf(e_str[3]);
					e_num1 = Math.abs(e_num1) % (rnd_names.length - 1);					
					let e_num2 = chars.indexOf(e_str[4]).toString()  + chars.indexOf(e_str[5]).toString()  + chars.indexOf(e_str[6]).toString() ;	
					e_num2 = e_num2.substring(0, 3);
					return rnd_names[e_num1] + e_num2;					
					
				} else {

					let rnd_num = irnd(0, rnd_names.length - 1);
					let rand_uid = irnd(0, 999999)+ 100;
					let name_postfix = rand_uid.toString().substring(0, 3);
					let name =	rnd_names[rnd_num] + name_postfix;				
					return name;
				}						
			},	
			
			yandex: function() {

				
				if(typeof(YaGames)==='undefined')
				{
					help_obj.local();
				}
				else
				{
					//если sdk яндекса найден
					YaGames.init({}).then(ysdk => {

						//фиксируем SDK в глобальной переменной
						window.ysdk=ysdk;

						//запрашиваем данные игрока
						return ysdk.getPlayer();


					}).then((_player)=>{


						my_data.name 	= _player.getName();
						my_data.uid 	= _player.getUniqueID().replace(/\//g, "Z");
						my_data.pic_url = _player.getPhoto('medium');

						//console.log(`Получены данные игрока от яндекса:\nимя:${my_data.name}\nid:${my_data.uid}\npic_url:${my_data.pic_url}`);

						//если нет данных то создаем их
						if (my_data.name=="" || my_data.name=='')
							my_data.name = help_obj.get_random_name(my_data.uid);


						help_obj.process_results();

					}).catch((err)=>{

						//загружаем из локального хранилища если нет авторизации в яндексе
						help_obj.local();

					})
				}
			},

			vk: function() {

				vkBridge.send('VKWebAppInit').then(()=>{
					
					return vkBridge.send('VKWebAppGetUserInfo');
					
				}).then((e)=>{
					
					my_data.name 	= e.first_name + ' ' + e.last_name;
					my_data.uid 	= "vk"+e.id;
					my_data.pic_url = e.photo_100;

					//console.log(`Получены данные игрока от VB MINIAPP:\nимя:${my_data.name}\nid:${my_data.uid}\npic_url:${my_data.pic_url}`);
					help_obj.process_results();		
					
				}).catch(function(e){
					
					alert(e);
					
				});

			},

			get_cg_user_data : async function(event) {
				
				return new Promise(function(resolve, reject) {

					let crazysdk = window.CrazyGames.CrazySDK.getInstance();
					crazysdk.init();
					
					crazysdk.addEventListener('initialized', function(event) {	
						my_data.country_code = event.userInfo.countryCode;	
						resolve();					
					});
					
				});
				
			},

			crazygames : async function() {
				
				//переключаем язык на английский
				LANG = 1;
				
				//запускаем сдк	и получаем информацию о стране			
				await help_obj.get_cg_user_data();
								
				//ищем в локальном хранилище
				let local_uid = null;
				try {
					local_uid = localStorage.getItem('uid');
				} catch (e) {
					console.log(e);
				}

				//здесь создаем нового игрока в локальном хранилище
				if (local_uid===undefined || local_uid===null) {

					//console.log("Создаем нового локального пользователя");
					let rnd_names=["Crazy","Monkey","Sky","Mad","Doom","Hash"];
					
					//console.log("Создаем нового локального пользователя");
					let rand_uid=Math.floor(Math.random() * 9999999);
					my_data.rating 		= 	1400;
					my_data.uid			=	"cg"+rand_uid;
					my_data.name 		=	 help_obj.get_random_name2(my_data.uid)+' (' + my_data.country_code +')';					
					my_data.pic_url		=	'https://avatars.dicebear.com/v2/male/'+irnd(10,10000)+'.svg';


					try {
						localStorage.setItem('uid',my_data.uid);
					} catch (e) {
						console.log(e);
					}
					
					help_obj.process_results();
				}
				else
				{
					//console.log(`Нашли айди в ЛХ (${local_uid}). Загружаем остальное из ФБ...`);
					
					my_data.uid = local_uid;	
					
					//запрашиваем мою информацию из бд или заносим в бд новые данные если игрока нет в бд
					firebase.database().ref("players/"+my_data.uid).once('value').then((snapshot) => {		
									
						var data=snapshot.val();
						
						//если на сервере нет таких данных
						if (data === null) {		
							//айди есть но данных нет, тогда заново их заносим
							my_data.rating 		= 	1400;
							my_data.name 		=	 help_obj.get_random_name2(my_data.uid)+' (' + my_data.country_code +')';					
							my_data.pic_url		=	'https://avatars.dicebear.com/v2/male/'+irnd(10,10000)+'.svg';
							
						} else {					
							
							my_data.pic_url = data.pic_url;
							my_data.name = data.name;							
						}
						
						help_obj.process_results();

					})	

				}			
	
			},

			debug: function() {

				let uid = prompt('Отладка. Введите ID', 100);

				my_data.name = my_data.uid = "debug" + uid;
				my_data.pic_url = "https://sun9-73.userapi.com/impf/c622324/v622324558/3cb82/RDsdJ1yXscg.jpg?size=223x339&quality=96&sign=fa6f8247608c200161d482326aa4723c&type=album";

				help_obj.process_results();

			},

			local: function(repeat = 0) {

				//ищем в локальном хранилище
				let local_uid = localStorage.getItem('uid');

				//здесь создаем нового игрока в локальном хранилище
				if (local_uid===undefined || local_uid===null) {

					//console.log("Создаем нового локального пользователя");
					let rand_uid=Math.floor(Math.random() * 9999999);
					my_data.rating 		= 	1400;
					my_data.uid			=	"ls"+rand_uid;
					my_data.name 		=	 help_obj.get_random_name(my_data.uid);					
					my_data.pic_url		=	'https://avatars.dicebear.com/v2/male/'+irnd(10,10000)+'.svg';

					try {
						localStorage.setItem('uid',my_data.uid);
					} catch (e) {
						console.log(e);
					}
					
					help_obj.process_results();
				}
				else
				{
					//console.log(`Нашли айди в ЛХ (${local_uid}). Загружаем остальное из ФБ...`);
					
					my_data.uid = local_uid;	
					
					//запрашиваем мою информацию из бд или заносим в бд новые данные если игрока нет в бд
					firebase.database().ref("players/"+my_data.uid).once('value').then((snapshot) => {		
									
						var data=snapshot.val();
						
						//если на сервере нет таких данных
						if (data === null) {
													
							//если повтоно нету данных то выводим предупреждение
							if (repeat === 1)
								alert('Какая-то ошибка');
							
							//console.log(`Нашли данные в ЛХ но не нашли в ФБ, повторный локальный запрос...`);	

							
							//повторно запускаем локальный поиск						
							localStorage.clear();
							help_obj.local(1);	
								
							
						} else {						
							
							my_data.pic_url = data.pic_url;
							my_data.name = data.name;
							help_obj.process_results();
						}

					})	

				}

			},

			unknown: function () {

				game_platform="unknown";
				alert("Неизвестная платформа! Кто Вы?")

				//загружаем из локального хранилища
				help_obj.local();
			},

			process_results: function() {

					
				//вызываем коллбэк
				resolve("ok");
			}
		}

		help_obj.init();

	});	
	
}

function resize() {
    const vpw = window.innerWidth;  // Width of the viewport
    const vph = window.innerHeight; // Height of the viewport
    let nvw; // New game width
    let nvh; // New game height

    if (vph / vpw < M_HEIGHT / M_WIDTH) {
      nvh = vph;
      nvw = (nvh * M_WIDTH) / M_HEIGHT;
    } else {
      nvw = vpw;
      nvh = (nvw * M_HEIGHT) / M_WIDTH;
    }
    app.renderer.resize(nvw, nvh);
    app.stage.scale.set(nvw / M_WIDTH, nvh / M_HEIGHT);
}

function vis_change() {

		if (document.hidden === true) {			
			if (pref.music_on === 1) gres.music.sound.pause();
			hidden_state_start = Date.now();			
		} else {			
			if (pref.music_on === 1) gres.music.sound.resume();			
		}
		
		set_state({hidden : document.hidden});
		
}

async function check_daily_reward (last_seen_ts) {
	
	
	//вычисляем номер дня последнего посещения
	let last_seen_day = new Date(last_seen_ts).getDate();		
	
	//считываем текущее время
	await firebase.database().ref("server_time").set(firebase.database.ServerValue.TIMESTAMP);

	//определяем текущий день
	let _cur_ts = await firebase.database().ref("server_time").once('value');
	let cur_ts = _cur_ts.val();
	let cur_day = new Date(cur_ts).getDate();
	
	//обновляем время последнего посещения
	firebase.database().ref("players/"+my_data.uid+"/tm").set(firebase.database.ServerValue.TIMESTAMP);
	if (cur_day !== last_seen_day)
	{		
		my_data.money++;
		firebase.database().ref("players/"+my_data.uid + "/money").set(my_data.money);	
		
		sound.play('daily_reward');

		objects.dr_title.text=['Ежедневный бонус!\n+1$','Daily reward!\n+1$'][LANG];
		await anim2.add(objects.dr_cont,{alpha:[0, 1]}, true, 1,'linear');
		await new Promise((resolve, reject) => setTimeout(resolve, 1000));
		anim2.add(objects.dr_cont,{alpha:[1, 0]}, false, 1,'linear');
		
	}

}

async function init_game_env() {
		
	
	await load_resources();
	
	
	//убираем загрузочные данные
	document.getElementById("m_bar").outerHTML = "";
	document.getElementById("m_progress").outerHTML = "";

	//короткое обращение к ресурсам
	gres=game_res.resources;

	app = new PIXI.Application({width:M_WIDTH, height:M_HEIGHT,antialias:false});
	let c = document.body.appendChild(app.view);
	c.style["boxShadow"] = "0 0 15px #000000";


	resize();
	window.addEventListener("resize", resize);

    //создаем спрайты и массивы спрайтов и запускаем первую часть кода
    for (var i = 0; i < load_list.length; i++) {
        const obj_class = load_list[i].class;
        const obj_name = load_list[i].name;
		console.log('Processing: ' + obj_name)

        switch (obj_class) {
        case "sprite":
            objects[obj_name] = new PIXI.Sprite(game_res.resources[obj_name].texture);
            eval(load_list[i].code0);
            break;

        case "block":
            eval(load_list[i].code0);
            break;

        case "cont":
            eval(load_list[i].code0);
            break;

        case "array":
			var a_size=load_list[i].size;
			objects[obj_name]=[];
			for (var n=0;n<a_size;n++)
				eval(load_list[i].code0);
            break;
        }
    }

    //обрабатываем вторую часть кода в объектах
    for (var i = 0; i < load_list.length; i++) {
        const obj_class = load_list[i].class;
        const obj_name = load_list[i].name;
		console.log('Processing: ' + obj_name)
		
		
        switch (obj_class) {
        case "sprite":
            eval(load_list[i].code1);
            break;

        case "block":
            eval(load_list[i].code1);
            break;

        case "cont":	
			eval(load_list[i].code1);
            break;

        case "array":
			var a_size=load_list[i].size;
				for (var n=0;n<a_size;n++)
					eval(load_list[i].code1);	;
            break;
        }
    }

	
	//загружаем данные об игроке
    auth().then((val)=> {

		//загружаем аватарку игрока
		return new Promise(function(resolve, reject) {
			let loader=new PIXI.Loader();
			loader.add("my_avatar", my_data.pic_url,{loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE, timeout: 5000});
			loader.load(function(l,r) {	resolve(l)});
		});

	}).then((l)=> {

		//устанавливаем фотки в попап и другие карточки
		objects.pic_1.pic.texture=l.resources.my_avatar.texture;
		get_server();
	
	}).catch((err)=>{
		alert(err.stack + " " + err);
	});
	
	//показыаем основное меню
	//main_menu.activate();

	//запускаем главный цикл
	main_loop();
	
}

async function load_resources() {

	//это нужно удалить потом
	/*document.body.innerHTML = "Привет!\nДобавляем в игру некоторые улучшения))\nЗайдите через 40 минут.";
	document.body.style.fontSize="24px";
	document.body.style.color = "red";
	return;*/


	let git_src="https://akukamil.github.io/whoiam/"
	//let git_src=""


	game_res=new PIXI.Loader();
	game_res.add("m2_font", git_src+"/fonts/MS_Comic_Sans/font.fnt");

	game_res.add("pic1", git_src+"/res/1.jpg");
	
    //добавляем из листа загрузки
    for (var i = 0; i < load_list.length; i++)
        if (load_list[i].class === "sprite" || load_list[i].class === "image" )
            game_res.add(load_list[i].name, git_src+"res/" + load_list[i].name + "." +  load_list[i].image_format);		

	game_res.onProgress.add(progress);
	function progress(loader, resource) {
		document.getElementById("m_bar").style.width =  Math.round(loader.progress)+"%";
	}
	
	await new Promise((resolve, reject)=> game_res.load(resolve))

}

function main_loop() {




	game_tick+=0.016666666;
	anim2.process();
	
	//обрабатываем минипроцессы
	for (let key in some_process)
		some_process[key]();	
	
	requestAnimationFrame(main_loop);
}

