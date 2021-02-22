//console.time("init");

// html init //

const plot_canvas = document.getElementById("plot");

plot_canvas.width = 960;
plot_canvas.height = 480;

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

let hit_array = [];
let prev_hitErrorArray_length = 0;

// plot section //

const ctx = plot_canvas.getContext("2d");

// Custom Area
const transparency_color = "rgba(255, 255, 255, 0)";
const point_color = "rgba(255, 255, 255, 1)";
const point_border_color = "rgba(0, 159, 255, 0)";
const point_radius = 2;

const accuracy_color_fade = 0.5;

// Plot Setup Area
const plot_data = {
	datasets: [{
		label: "",
		data: hit_array,
		backgroundColor: point_color,
		borderColor: point_border_color,
		pointRadius: point_radius,
	}]
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

let od_miss_ms;
let od_good_ms;
let od_perfect_ms;

function drawBackground(target) {
	const x_scale = target.scales["x-axis-1"];
	const y_scale = target.scales["y-axis-1"];
	const x_left = x_scale.left;

	const plus_miss_px = y_scale.getPixelForValue(od_miss_ms);
	const plus_good_px = y_scale.getPixelForValue(od_good_ms);
	const plus_perfect_px = y_scale.getPixelForValue(od_perfect_ms);

	const zero_px = y_scale.getPixelForValue(0);

	const minus_miss_px = y_scale.getPixelForValue(-(od_miss_ms));
	const minus_good_px = y_scale.getPixelForValue(-(od_good_ms));
	const minus_perfect_px = y_scale.getPixelForValue(-(od_perfect_ms));

	const plus_miss_height = plus_good_px - plus_miss_px;
	const plus_good_height = plus_perfect_px - plus_good_px;
	const plus_perfect_height = zero_px - plus_perfect_px;

	const minus_perfect_height = zero_px - minus_perfect_px;
	const minus_good_height = minus_perfect_px - minus_good_px;
	const minus_miss_height = minus_good_px - minus_miss_px;

	// +ms
	ctx.fillStyle = `rgba(218, 174, 70, ${accuracy_color_fade})`;
	ctx.fillRect(x_left, plus_miss_px, x_scale.width, plus_miss_height);

	// +gd
	ctx.fillStyle = `rgba(87, 227, 19, ${accuracy_color_fade})`;
	ctx.fillRect(x_left, plus_good_px, x_scale.width, plus_good_height);

	// +pf
	ctx.fillStyle = `rgba(50, 187, 230, ${accuracy_color_fade})`;
	ctx.fillRect(x_left, plus_perfect_px, x_scale.width, plus_perfect_height);

	// -pf
	ctx.fillStyle = `rgba(50, 187, 230, ${accuracy_color_fade})`;
	ctx.fillRect(x_left, minus_perfect_px, x_scale.width, minus_perfect_height);

	// -gd
	ctx.fillStyle = `rgba(87, 227, 19, ${accuracy_color_fade})`;
	ctx.fillRect(x_left, minus_good_px, x_scale.width, minus_good_height);

	// -ms
	ctx.fillStyle = `rgba(218, 174, 70, ${accuracy_color_fade})`;
	ctx.fillRect(x_left, minus_miss_px, x_scale.width, minus_miss_height);

	const center_px = y_scale.getPixelForValue(0.5);
	const center_height = center_px - y_scale.getPixelForValue(-0.5);

	ctx.fillStyle = `rgba(255, 0, 0, ${accuracy_color_fade})`;
	ctx.fillRect(x_left, center_px, x_scale.width, center_height);
};

const plot_chart = new Chart(ctx, {
	type: "scatter",
	data: plot_data,
	options: plot_options,
	plugins: [{
		beforeDraw: drawBackground
	}]
});

// od section //

const ez = 0b10;
const hr = 0b10000;
/*
const dt = 0b1000000;
const ht = 0b100000000;

const dthr = dt + hr;
const dtez = dt + ez;
const hthr = ht + hr;
const htez = ht + ez;
*/

/* hard to adjust
const std_300 = od => 79 - (od * 6) + 0.5;
const std_100 = od => 139 - (od * 8) + 0.5;
const std_50 = od => 199 - (od * 10) + 0.5;

const taiko_300 = od => 49 - (od * 3) +0.5;
const taiko_100_up5 = od => 119 - (od * 6) +0.5;
const taiko_100_above5 = od => 79 - ((od - 5) * 8) + 0.5;
const taiko_miss = od => (10 - od) * 10 + 100;
*/

const mania_300 = od => 64 - (od * 3);
const mania_100 = od => 127 - (od * 3);
const mania_50 = od => 151 - (od * 3);

/*
const dt_calc = value => value * 2 / 3 + 0.33;
const ht_calc = value => value * 4 / 3 + 0.66;
*/

const mania_hr_calc = value => Math.floor(value / 1.4);
const mania_ez_calc = value => Math.floor(value * 1.4);

const update_od_ms = (od, mods_num) => {
	if ((mods_num & hr) == hr) {
		od_miss_ms = mania_hr_calc(mania_50(od));
		od_good_ms = mania_hr_calc(mania_100(od));
		od_perfect_ms = mania_hr_calc(mania_300(od));
	}
	else if ((mods_num & ez) == ez) {
		od_miss_ms = mania_ez_calc(mania_50(od));
		od_good_ms = mania_ez_calc(mania_100(od));
		od_perfect_ms = mania_ez_calc(mania_300(od));
	}
	else {
		od_miss_ms = mania_50(od);
		od_good_ms = mania_100(od);
		od_perfect_ms = mania_300(od);
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

socket.onmessage = async event => {
	//console.time("messageEvent");

	const osu_status = JSON.parse(event.data);

	const audio_path = "http://127.0.0.1:24050/Songs/" + encodeURIComponent(osu_status.menu.bm.path.folder + "/" + osu_status.menu.bm.path.audio);
	if (audio_path != current_audio_path) {
		try {
			current_audio_drain = await get_audio_end_drain(audio_path) * 1000;
			current_audio_path = audio_path;

			if (typeof(plot_chart.options.scales.xAxes[0].ticks.max) === "undefined") {
				console.log("Switched audio plot mode");
			}
			plot_chart.options.scales.xAxes[0].ticks.max = current_audio_drain;
		}
		catch {
			delete plot_chart.options.scales.xAxes[0].ticks.max;
			console.log("Switched realtime plot mode");

			current_audio_drain = 0;
			current_audio_path = audio_path;
		}
	}

	update_od_ms(osu_status.menu.gameMode == 3 ? osu_status.menu.bm.stats.memoryOD : osu_status.menu.bm.stats.OD, osu_status.menu.mods.num);
	/* old od calc
	console.log((osu_status.menu.mods.num & 0b1000000) == 0b1000000);
	od_miss_ms = 151.5 - (osu_status.menu.bm.stats.memoryOD * 3);
	od_good_ms = 127.5 - (osu_status.menu.bm.stats.memoryOD * 3);
	od_perfect_ms = 64.5 - (osu_status.menu.bm.stats.memoryOD * 3);
	*/

	if (osu_status.gameplay.hits.hitErrorArray) {
		if (osu_status.gameplay.hits.hitErrorArray.length == 0) {
			hit_array = [];
		}
		else {
			const hitErrorArray = osu_status.gameplay.hits.hitErrorArray.slice(prev_hitErrorArray_length);
			//console.log(hit_array);

			for (let i = 0; i < hitErrorArray.length; i++) {
				const hitError = hitErrorArray[i];
				//console.log(osu_status.menu.bm.time.current);
				hit_array.push({
					x: osu_status.menu.bm.time.current,
					y: hitError
				});
			}

			prev_hitErrorArray_length = osu_status.gameplay.hits.hitErrorArray.length;
		}
	}
	else {
		hit_array = [];
	}

	if (osu_status.menu.state != 7 && osu_status.menu.state != 2) {
		hit_array = [];
		prev_hitErrorArray_length = 0;

		plot_canvas.style.display = "none";
	}
	else {
		if (hit_array.length != 0 || osu_status.menu.state == 2) plot_canvas.style.display = "";
	}

	plot_chart.data.datasets[0].data = hit_array;
	plot_chart.options.scales.yAxes[0].ticks.min = -(od_miss_ms);
	plot_chart.options.scales.yAxes[0].ticks.max = od_miss_ms;
	plot_chart.update();

	//console.timeEnd("messageEvent");
};

//console.timeEnd("init");
