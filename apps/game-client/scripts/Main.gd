extends Node2D

@onready var label := Label.new()

func _ready():
    add_child(label)
    label.text = "MERC Client (Godot) — connect to server and stream chunks"
    label.position = Vector2(16,16)
