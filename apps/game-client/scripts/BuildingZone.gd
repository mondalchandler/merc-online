extends Area2D

func _on_body_entered(body: Node) -> void:
	if body.is_in_group("player"):
		if body.has_method("set_inside_building"):
			body.set_inside_building(true)

func _on_body_exited(body: Node) -> void:
	if body.is_in_group("player"):
		if body.has_method("set_inside_building"):
			body.set_inside_building(false)
