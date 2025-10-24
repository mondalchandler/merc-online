extends Node2D
# Very basic placeholder for 'streaming' city chunks
# In a real project, you'd load scenes or tilemap data from disk or a CDN.

var loaded_chunks := {}
var chunk_size := 64

func world_to_chunk(pos: Vector2i) -> Vector2i:
	return Vector2i(floor(pos.x / chunk_size), floor(pos.y / chunk_size))

func ensure_chunk(cx: int, cy: int):
	var key = str(cx,":",cy)
	if loaded_chunks.has(key): return
	var tile := ColorRect.new()
	tile.color = Color(0.1 + 0.1 * float((cx+cy) % 5), 0.12, 0.15)
	tile.size = Vector2(chunk_size, chunk_size)
	tile.position = Vector2(cx*chunk_size, cy*chunk_size)
	add_child(tile)
	loaded_chunks[key] = tile

func _process(_dt):
	var p := get_viewport().get_visible_rect().position
	var s := get_viewport().get_visible_rect().size
	var c0 := world_to_chunk(Vector2i(p))
	var c1 := world_to_chunk(Vector2i(p + s))
	for cx in range(c0.x-1, c1.x+2):
		for cy in range(c0.y-1, c1.y+2):
			ensure_chunk(cx, cy)
