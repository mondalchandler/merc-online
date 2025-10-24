extends Node2D

@onready var label := Label.new()

func _ready():
	add_child(label)
	label.text = "MERC Client (Godot) — hello!"
	label.position = Vector2(16, 16)
