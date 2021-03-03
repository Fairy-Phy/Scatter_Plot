//console.time("init");

// html init //

const plot_canvas = document.getElementById("plot");

plot_canvas.width = plot_width;
plot_canvas.height = plot_height;

// socket init //

const socket = new ReconnectingWebSocket("ws://127.0.0.1:24050/ws");

socket.onopen = () => {
	console.log("Successfully Connected");
};

socket.onclose = event => {
	console.log("Socket Closed Connection: ", event);
	socket.send("Client Closed!");
};

socket.onerror = error => {
	console.log("Socket Error: ", error);
};

// main //

//let hit_array = [];

let hit_miss_array = [];
let hit_50_array = [];
let hit_100_array = [];
let hit_200_array = [];
let hit_300_array = [];
let hit_300g_array = [];

let prev_hitErrorArray_length = 0;

// plot section //

const ctx = plot_canvas.getContext("2d");

// Plot Setup Area
const plot_data = {
	datasets: [
		/*{ // old hit_array
			label: "old hit_array",
			data: hit_array,
			backgroundColor: simple_point ? point_color : etterna_mode ? etterna_300g_point_color : osu_perfect_point_color,
			borderColor: point_border_color,
			pointRadius: point_radius,
		},*/
		{ // 300g
			label: "300g",
			data: hit_300g_array,
			backgroundColor: simple_point ? point_color : etterna_mode ? etterna_300g_point_color : osu_perfect_point_color,
			borderColor: point_border_color,
			pointRadius: point_radius,
		},
		{ // 300
			label: "300",
			data: hit_300_array,
			backgroundColor: simple_point ? point_color : etterna_mode ? etterna_300_point_color : osu_perfect_point_color,
			borderColor: point_border_color,
			pointRadius: point_radius,
		},
		{ // 200
			label: "200",
			data: hit_200_array,
			backgroundColor: simple_point ? point_color : etterna_mode ? etterna_200_point_color : osu_good_point_color,
			borderColor: point_border_color,
			pointRadius: point_radius,
		},
		{ // 100
			label: "100",
			data: hit_100_array,
			backgroundColor: simple_point ? point_color : etterna_mode ? etterna_100_point_color : osu_good_point_color,
			borderColor: point_border_color,
			pointRadius: point_radius,
		},
		{ // 50
			label: "50",
			data: hit_50_array,
			backgroundColor: simple_point ? point_color : etterna_mode ? etterna_50_point_color : osu_miss_point_color,
			borderColor: point_border_color,
			pointRadius: point_radius,
		},
		{ // miss
			label: "miss",
			data: hit_miss_array,
			backgroundColor: simple_point ? point_color : etterna_mode ? etterna_miss_point_color : osu_miss_point_color,
			borderColor: point_border_color,
			pointRadius: point_radius,
		}
	]
};

const plot_options = {
	responsive: false,
	title: {
		display: false,
		fontSize: 14,
		fontStyle: "normal",
		padding: 0,
		text: "Accuracy Scatter"
	},
	legend: {
		display: false,
		align: "start",
		position: "right",
		labels: {
			padding: 0
		}
	},
	scales: {
		xAxes: [{
			scaleLabel: {
				display: false,
				labelString: "Time",
			},
			gridLines: {
				color: transparency_color,
				zeroLineColor: transparency_color
			},
			ticks: {
				display: false,
				fontColor: transparency_color,
				min: 0,
				max: 0,
				stepSize: 10,
			},
		}],
		yAxes: [{
			display: true,
			scaleLabel: {
				display: false,
				labelString: "Hit Error",
			},
			gridLines: {
				color: transparency_color,
				zeroLineColor: transparency_color
			},
			ticks: {
				display: false,
				fontColor: transparency_color,
				min: 0,
				max: 1,
				stepsize: 5,
				beginAtZero: true
			}
		}]
	},
	tooltips: {
		enabled: false
	}
};

if (result_only) plot_options.animation = false;

let od_50_ms;
let od_100_ms;
let od_300_ms;

// etterna style only
let od_miss_ms;
let od_200_ms;
let od_300g_ms;
let x_left_memory;
let y_top_memory;
let y_bottom_memory;

const draw_border = target => {
	const x_scale = target.scales["x-axis-1"];
	const y_scale = target.scales["y-axis-1"];
	const x_left = x_scale.left;
	const y_top = y_scale.top;

	if (etterna_mode) {
		const plus_50_px = y_scale.getPixelForValue(od_50_ms);
		const plus_100_px = y_scale.getPixelForValue(od_100_ms);
		const plus_200_px = y_scale.getPixelForValue(od_200_ms);
		const plus_300_px = y_scale.getPixelForValue(od_300_ms);
		const plus_300g_px = y_scale.getPixelForValue(od_300g_ms);

		const zero_px = y_scale.getPixelForValue(0);

		const minus_50_px = y_scale.getPixelForValue(-(od_50_ms));
		const minus_100_px = y_scale.getPixelForValue(-(od_100_ms));
		const minus_200_px = y_scale.getPixelForValue(-(od_200_ms));
		const minus_300_px = y_scale.getPixelForValue(-(od_300_ms));
		const minus_300g_px = y_scale.getPixelForValue(-(od_300g_ms));

		const plus_50_height = plus_100_px - plus_50_px;
		const plus_100_height = plus_200_px - plus_100_px;
		const plus_200_height = plus_300_px - plus_200_px;
		const plus_300_height = plus_300g_px - plus_300_px;
		const plus_300g_height = zero_px - plus_300g_px;

		const minus_300_height = zero_px - minus_300_px;
		const minus_100_height = minus_300_px - minus_100_px;
		const minus_50_height = minus_100_px - minus_50_px;

		// black screen
		ctx.fillStyle = etterna_black_color;
		ctx.fillRect(x_left, y_top, x_scale.width, y_scale.height);

		// +50
		//ctx.fillStyle = osu_miss_color;
		//ctx.fillRect(x_left, plus_50_px, x_scale.width, etterna_line_thickness);

		// +100
		ctx.fillStyle = etterna_50_color;
		ctx.fillRect(x_left, plus_100_px, x_scale.width, etterna_line_thickness);

		// +200
		ctx.fillStyle = etterna_100_color;
		ctx.fillRect(x_left, plus_200_px, x_scale.width, etterna_line_thickness);

		// +300
		ctx.fillStyle = etterna_200_color;
		ctx.fillRect(x_left, plus_300_px, x_scale.width, etterna_line_thickness);

		// +300g
		ctx.fillStyle = etterna_300_color;
		ctx.fillRect(x_left, plus_300g_px, x_scale.width, etterna_line_thickness);

		// center
		const center_px = y_scale.getPixelForValue(0.5);
		const center_height = center_px - y_scale.getPixelForValue(-0.5);

		ctx.fillStyle = etterna_300g_color;
		ctx.fillRect(x_left, center_px, x_scale.width, center_height);

		// -300g
		ctx.fillStyle = etterna_300_color;
		ctx.fillRect(x_left, minus_300g_px, x_scale.width, etterna_line_thickness);

		// -300
		ctx.fillStyle = etterna_200_color;
		ctx.fillRect(x_left, minus_300_px, x_scale.width, etterna_line_thickness);

		// -200
		ctx.fillStyle = etterna_100_color;
		ctx.fillRect(x_left, minus_200_px, x_scale.width, etterna_line_thickness);

		// -100
		ctx.fillStyle = etterna_50_color;
		ctx.fillRect(x_left, minus_100_px, x_scale.width, etterna_line_thickness);

		// -50
		//ctx.fillStyle = osu_miss_color;
		//ctx.fillRect(x_left, minus_50_px, x_scale.width, etterna_line_thickness);

		if (etterna_show_text) {
			x_left_memory = x_left;
			y_top_memory = y_top;
			y_bottom_memory = y_scale.getPixelForValue(-(od_miss_ms));
		}
	}
	else {
		const plus_miss_px = y_scale.getPixelForValue(od_50_ms);
		const plus_good_px = y_scale.getPixelForValue(od_100_ms);
		const plus_perfect_px = y_scale.getPixelForValue(od_300_ms);

		const zero_px = y_scale.getPixelForValue(0);

		const minus_miss_px = y_scale.getPixelForValue(-(od_50_ms));
		const minus_good_px = y_scale.getPixelForValue(-(od_100_ms));
		const minus_perfect_px = y_scale.getPixelForValue(-(od_300_ms));

		const plus_miss_height = plus_good_px - plus_miss_px;
		const plus_good_height = plus_perfect_px - plus_good_px;
		const plus_perfect_height = zero_px - plus_perfect_px;

		const minus_perfect_height = zero_px - minus_perfect_px;
		const minus_good_height = minus_perfect_px - minus_good_px;
		const minus_miss_height = minus_good_px - minus_miss_px;

		// +ms
		ctx.fillStyle = osu_miss_color;
		ctx.fillRect(x_left, plus_miss_px, x_scale.width, plus_miss_height);

		// +gd
		ctx.fillStyle = osu_good_color;
		ctx.fillRect(x_left, plus_good_px, x_scale.width, plus_good_height);

		// +pf
		ctx.fillStyle = osu_perfect_color;
		ctx.fillRect(x_left, plus_perfect_px, x_scale.width, plus_perfect_height);

		// -pf
		ctx.fillStyle = osu_perfect_color;
		ctx.fillRect(x_left, minus_perfect_px, x_scale.width, minus_perfect_height);

		// -gd
		ctx.fillStyle = osu_good_color;
		ctx.fillRect(x_left, minus_good_px, x_scale.width, minus_good_height);

		// -ms
		ctx.fillStyle = osu_miss_color;
		ctx.fillRect(x_left, minus_miss_px, x_scale.width, minus_miss_height);

		const center_px = y_scale.getPixelForValue(0.5);
		const center_height = center_px - y_scale.getPixelForValue(-0.5);

		ctx.fillStyle = osu_center_color;
		ctx.fillRect(x_left, center_px, x_scale.width, center_height);
	}
};

// etterna style only
const draw_text = () => {
	if (etterna_show_text) {
		ctx.fillStyle = etterna_white_color;
		ctx.font = `${etterna_text_size_px}px sans-serif`;
		ctx.fillText(`Late (${Math.floor(od_miss_ms)}ms)`, x_left_memory + etterna_text_padding_px, y_top_memory + etterna_text_size_px + etterna_text_padding_px);
		ctx.fillText(`Early (-${Math.floor(od_miss_ms)}ms)`, x_left_memory + etterna_text_padding_px, y_bottom_memory - (etterna_text_size_px / 4) - etterna_text_padding_px);
	}
};

const plot_chart = new Chart(ctx, {
	type: "scatter",
	data: plot_data,
	options: plot_options,
	plugins: [{
		beforeDraw: draw_border,
		afterDraw: draw_text
	}]
});

// od section //

const ez = 0b10;
const hr = 0b10000;
const v2 = 0x20000000;


const mania_300g = 16;
const mania_300g_v2 = od => {
	if (od > 5) {
		return 19.4+((13.9-19.4)*(od-5)/5);
	}
	else {
		return 19.4-((19.4-22.4)*(5-od)/5);
	}
}
const mania_300 = od => 64 - (od * 3);
const mania_200 = od => 97 - (od * 3);
const mania_100 = od => 127 - (od * 3);
const mania_50 = od => 151 - (od * 3);
const mania_miss = od => 188 - (od * 3);

const mania_hr_calc = value => Math.floor(value / 1.4);
const mania_ez_calc = value => Math.floor(value * 1.4);

const update_od_ms = (od, mods_num) => {
	if ((mods_num & hr) == hr) {
		if((mods_num & v2) == v2){
			od_300g_ms = mania_hr_calc(mania_300g_v2(od));
		}
		else{
			od_300g_ms = mania_hr_calc(mania_300g);
		}
		od_miss_ms = mania_hr_calc(mania_miss(od));
		od_50_ms = mania_hr_calc(mania_50(od));
		od_100_ms = mania_hr_calc(mania_100(od));
		od_200_ms = mania_hr_calc(mania_200(od));
		od_300_ms = mania_hr_calc(mania_300(od));
	}
	else if ((mods_num & ez) == ez) {
		if((mods_num & v2) == v2){
			od_300g_ms = mania_ez_calc(mania_300g_v2(od));
		}
		else{
			od_300g_ms = mania_ez_calc(mania_300g);
		}
		od_miss_ms = mania_ez_calc(mania_miss(od));
		od_50_ms = mania_ez_calc(mania_50(od));
		od_100_ms = mania_ez_calc(mania_100(od));
		od_200_ms = mania_ez_calc(mania_200(od));
		od_300_ms = mania_ez_calc(mania_300(od));
	}
	else {
		if((mods_num & v2) == v2){
			od_300g_ms = mania_300g_v2(od);
		}
		od_miss_ms = mania_miss(od);
		od_50_ms = mania_50(od);
		od_100_ms = mania_100(od);
		od_200_ms = mania_200(od);
		od_300_ms = mania_300(od);
	}
};

// socket section//

let current_audio_path = "";
let current_audio_drain = 0;

const get_audio_end_drain = audio_path => new Promise((resolve, reject) => {
	const audio = new Audio();
	audio.src = audio_path;
	audio.load();

	audio.addEventListener("loadedmetadata", () => {
		resolve(audio.duration);
	});

	audio.addEventListener("error", () => {
		reject();
	});
});

let force_switch = false;

socket.onmessage = async event => {
	//console.time("messageEvent");

	const osu_status = JSON.parse(event.data);
	const audio_path = "http://127.0.0.1:24050/Songs/" + encodeURIComponent(osu_status.menu.bm.path.folder + "/" + osu_status.menu.bm.path.audio);;
	if (audio_path != current_audio_path && audio_base_plot) {
		try {
			current_audio_drain = await get_audio_end_drain(audio_path) * 1000;
			current_audio_path = audio_path;

			if (force_switch) {
				force_switch = false;
				console.log("Switched audio plot mode");
			}
			plot_chart.options.scales.xAxes[0].ticks.max = current_audio_drain;
		}
		catch {
			force_switch = true;
			console.log("Switched realtime plot mode");

			current_audio_drain = 0;
			current_audio_path = audio_path;
		}
	}
	else if ((!audio_base_plot || force_switch) && osu_status.menu.state == 2) {
		plot_chart.options.scales.xAxes[0].ticks.max = osu_status.menu.bm.time.current;
	}

	update_od_ms(osu_status.menu.gameMode == 3 ? osu_status.menu.bm.stats.memoryOD : osu_status.menu.bm.stats.OD, osu_status.menu.mods.num);
	/* old od calc
	console.log((osu_status.menu.mods.num & 0b1000000) == 0b1000000);
	od_50_ms = 151.5 - (osu_status.menu.bm.stats.memoryOD * 3);
	od_100_ms = 127.5 - (osu_status.menu.bm.stats.memoryOD * 3);
	od_300_ms = 64.5 - (osu_status.menu.bm.stats.memoryOD * 3);
	*/

	if (osu_status.gameplay.hits.hitErrorArray) {
		if (osu_status.gameplay.hits.hitErrorArray.length == 0) {
			// hit_array = [];

			hit_miss_array = [];
			hit_50_array = [];
			hit_100_array = [];
			hit_200_array = [];
			hit_300_array = [];
			hit_300g_array = [];
		}
		else {
			const hitErrorArray = osu_status.gameplay.hits.hitErrorArray.slice(prev_hitErrorArray_length);
			//console.log(hit_array);

			for (let i = 0; i < hitErrorArray.length; i++) {
				const hitError = hitErrorArray[i];
				//console.log(osu_status.menu.bm.time.current);
				/*hit_array.push({
					x: osu_status.menu.bm.time.current,
					y: hitError
				});*/

				if (hitError <= od_300g_ms && hitError >= -(od_300g_ms)) {
					hit_300g_array.push({
						x: osu_status.menu.bm.time.current,
						y: hitError
					});
				}
				else if (hitError <= od_300_ms && hitError >= -(od_300_ms)) {
					hit_300_array.push({
						x: osu_status.menu.bm.time.current,
						y: hitError
					});
				}
				else if (hitError <= od_200_ms && hitError >= -(od_200_ms)) {
					hit_200_array.push({
						x: osu_status.menu.bm.time.current,
						y: hitError
					});
				}
				else if (hitError <= od_100_ms && hitError >= -(od_100_ms)) {
					hit_100_array.push({
						x: osu_status.menu.bm.time.current,
						y: hitError
					});
				}
				else if (hitError <= od_50_ms && hitError >= -(od_50_ms)) {
					hit_50_array.push({
						x: osu_status.menu.bm.time.current,
						y: hitError
					});
				}
				else {
					hit_miss_array.push({
						x: osu_status.menu.bm.time.current,
						y: hitError
					});
				}
			}

			prev_hitErrorArray_length = osu_status.gameplay.hits.hitErrorArray.length;
		}
	}
	else {
		//hit_array = [];

		hit_miss_array = [];
		hit_50_array = [];
		hit_100_array = [];
		hit_200_array = [];
		hit_300_array = [];
		hit_300g_array = [];
	}

	if (osu_status.menu.state != 7 && osu_status.menu.state != 2) {
		//hit_array = [];

		hit_miss_array = [];
		hit_50_array = [];
		hit_100_array = [];
		hit_200_array = [];
		hit_300_array = [];
		hit_300g_array = [];

		prev_hitErrorArray_length = 0;

		if (!always_show) plot_canvas.style.display = "none";
	}
	else {
		if (((hit_300g_array.length + hit_300_array.length + hit_200_array.length + hit_100_array.length + hit_50_array.length + hit_miss_array.length) != 0 && osu_status.menu.state == 7) || (osu_status.menu.state == 2 && !result_only) || always_show) plot_canvas.style.display = "";
	}

	//plot_chart.data.datasets[0].data = hit_array;

	plot_chart.data.datasets[0].data = hit_300g_array;
	plot_chart.data.datasets[1].data = hit_300_array;
	plot_chart.data.datasets[2].data = hit_200_array;
	plot_chart.data.datasets[3].data = hit_100_array;
	plot_chart.data.datasets[4].data = hit_50_array;
	plot_chart.data.datasets[5].data = hit_miss_array;
	if (etterna_mode) {
		plot_chart.options.scales.yAxes[0].ticks.min = -(od_miss_ms);
		plot_chart.options.scales.yAxes[0].ticks.max = od_miss_ms;
	}
	else {
		plot_chart.options.scales.yAxes[0].ticks.min = -(od_50_ms);
		plot_chart.options.scales.yAxes[0].ticks.max = od_50_ms;
	}
	plot_chart.update();

	//console.timeEnd("messageEvent");
};

//console.timeEnd("init");
