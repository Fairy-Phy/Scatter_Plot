# Scatter_Plot

gosumemory scatter plot theme

Making this for osumania. But you can run it in other modes as well.

## Preview

### osu! mode

![osu! mode preview](https://raw.githubusercontent.com/Fairy-Phy/Scatter_Plot/gif/2021-02-24%2000-08-09-1.gif)

### etterna mode

![etterna mode preview](https://raw.githubusercontent.com/Fairy-Phy/Scatter_Plot/gif/2021-02-23%2023-45-04-1.gif)

## Usage

The prerequisite is that you already have a [gosumemory](https://github.com/l3lackShark/gosumemory).

It's really easy. Just unzip the downloaded folder and put it in your ``gosumemory/static`` folder.

## Config

### Basic Settings

| Var Name | Description | Type |
|:--------:|:-----------:|:----:|
| result_only | Displayed only during result screen | true/false |
| etterna_mode | Switch to Etterna mode | true/false |
| audio_base_plot | Plotting method based on music file | true/false |
| plot_width | Plot width (will be slightly smaller than the specified width) | Number(Integer) |
| plot_height | Plot height (will be slightly smaller than the specified height) | Number(Integer) |
| simple_point | If set to true, the color of the point will not be changed for each judgement | true/false |
| point_radius | Radius of points | Number |
| accuracy_color_fade | Background opacity (you don't need to use this if you change the color in Advanced Setting) | Number |
| etterna_line_thickness | Background line thickness in Etterna mode | Number |
| etterna_show_text | Whether to show Early/Late in Etterna mode or not | true/false |

### Advanced Settings

| Var Name | Description | Type |
|:--------:|:-----------:|:----:|
| transparency_color | Color to practically hide the graph text | Character String(CSS[\<color\>](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)) |
| point_color | Color of points when simple_point is true | Character String(CSS[\<color\>](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)) |
| point_border_color | Color of the outer frame of the point (basically transparent because it is hidden) | Character String(CSS[\<color\>](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)) |
| osu_center_color | Color of the center in osu mode | Character String(CSS[\<color\>](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)) |
| osu_perfect_color | Colors up to 300 in osu mode | Character String(CSS[\<color\>](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)) |
| osu_good_color | Colors up to 100 in osu mode | Character String(CSS[\<color\>](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)) |
| osu_miss_color | Colors up to miss in osu mode | Character String(CSS[\<color\>](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)) |
| osu_perfect_point_color | Color of points up to 300 in osu mode | Character String(CSS[\<color\>](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)) |
| osu_good_point_color | Color of points up to 100 in osu mode | Character String(CSS[\<color\>](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)) |
| osu_miss_point_color | Color of points up to miss in osu mode | Character String(CSS[\<color\>](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)) |
| etterna_white_color | Text color in Etterna mode | Character String(CSS[\<color\>](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)) |
| etterna_black_color | Background color in Etterna mode | Character String(CSS[\<color\>](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)) |
| etterna_300g_color | Color of 300g in Etterna mode | Character String(CSS[\<color\>](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)) |
| etterna_300_color | Color of 300 in Etterna mode | Character String(CSS[\<color\>](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)) |
| etterna_200_color | Color of 200 in Etterna mode | Character String(CSS[\<color\>](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)) |
| etterna_100_color | Color of 100 in Etterna mode | Character String(CSS[\<color\>](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)) |
| etterna_50_color | Color of 50 in Etterna mode | Character String(CSS[\<color\>](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)) |
| etterna_miss_color | Color of miss in Etterna mode | Character String(CSS[\<color\>](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)) |
| etterna_300g_point_color | Color of 300g points in Etterna mode | Character String(CSS[\<color\>](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)) |
| etterna_300_point_color | Color of 300 points in Etterna mode | Character String(CSS[\<color\>](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)) |
| etterna_200_point_color | Color of 200 points in Etterna mode | Character String(CSS[\<color\>](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)) |
| etterna_100_point_color | Color of 100 points in Etterna mode | Character String(CSS[\<color\>](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)) |
| etterna_50_point_color | Color of 50 points in Etterna mode | Character String(CSS[\<color\>](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)) |
| etterna_miss_point_color | Color of miss points in Etterna mode | Character String(CSS[\<color\>](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)) |
| etterna_text_size_px | Text size(px) in Etterna mode | Number |
| etterna_text_padding_px | Text margins in Etterna mode (left and top margins for Late, left and bottom margins for Early) | Number |

### Debug Setting

| Var Name | Description | Type |
|:--------:|:-----------:|:----:|
| always_show | will not hide it every time | true/false |
