extends Area2D

@export var speed: float = 600.0

func _ready() -> void:
	$Timer.timeout.connect(_on_timeout)
	area_entered.connect(_on_area_entered)

func _physics_process(delta: float) -> void:
	# Move forward along facing direction
	global_position += Vector2.RIGHT.rotated(rotation) * speed * delta

func _on_timeout() -> void:
	queue_free()

func _on_area_entered(area: Area2D) -> void:
	# If bullet hits something, both disappear (simple test)
	if area.is_in_group("enemy"):
		area.queue_free()
	queue_free()
