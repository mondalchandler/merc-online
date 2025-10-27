extends CharacterBody2D

@export var speed: float = 200.0

var is_inside_building: bool = false     # prep for indoor/outdoor mode
var time_of_day: float = 0.0             # 0.0..1.0 cycle preview (prep for day/night)
var bullet_scene: PackedScene = preload("res://scenes/Bullet.tscn")

@onready var muzzle: Node2D = $Gun/Muzzle
@onready var ui_label: Label = $"../UI/Label"
@onready var cam: Camera2D = $Camera2D
@onready var start_pos: Vector2 = global_position

func _physics_process(delta: float) -> void:
	# 1. Movement
	var dir := Vector2.ZERO
	dir.x = Input.get_action_strength("move_right") - Input.get_action_strength("move_left")
	dir.y = Input.get_action_strength("move_down") - Input.get_action_strength("move_up")
	if dir.length() > 1.0:
		dir = dir.normalized()
	velocity = dir * speed
	move_and_slide()

	# 2. Aim toward mouse
	look_at(get_global_mouse_position())

	# 3. Update internal timers (prep for day/night)
	_tick_time_of_day(delta)

	# 4. Update debug UI each frame
	_update_debug_label()

func _input(event: InputEvent) -> void:
	# Shoot
	if event.is_action_pressed("shoot"):
		_fire_bullet()

	# Manual respawn
	if event.is_action_pressed("respawn"):
		_respawn()

func _respawn() -> void:
	global_position = start_pos
	velocity = Vector2.ZERO

func _fire_bullet() -> void:
	var b = bullet_scene.instantiate()
	get_tree().current_scene.add_child(b)
	b.global_position = muzzle.global_position
	b.rotation = rotation

func _tick_time_of_day(delta: float) -> void:
	# This just spins time_of_day slowly 0..1..0..1, etc.
	time_of_day = fmod(time_of_day + delta * 0.01, 1.0)
	# You won't see lighting change yet unless you wire in a WorldEnvironment.
	# We're just tracking it now so UI can show it and we can hook visuals later.

func _update_debug_label() -> void:
	if ui_label:
		var tod_percent := int(time_of_day * 100.0)
		ui_label.text = "inside=" + str(is_inside_building) + \
						" | time=" + str(tod_percent) + "%"

func set_inside_building(state: bool) -> void:
	is_inside_building = state
	# Prep for camera swap logic (outside vs inside)
	# We'll eventually add:
	#   - cam.zoom or cam.rotation or shader toggles here
	# For now it's just tracked.
