extends Node
class_name NetworkManager

var jwt: String = ""
var user_id: String = ""
var api_base: String = "http://localhost:2567"
const AUTH_PATH := "user://auth.json"

@onready var player: Node2D = $"../Player" # adjust if needed
var _send_accum := 0.0 # throttle network sends

func _ready() -> void:
	print("NetworkManager ready")
	_load_auth()
	if jwt == "" or user_id == "":
		login_guest_user()
	else:
		print("Loaded JWT for", user_id)
		join_city_room()

func _physics_process(delta: float) -> void:
	# Throttle: send ~10Hz
	_send_accum += delta
	if _send_accum >= 0.1:
		_send_accum = 0.0
		_send_my_transform()

func _send_my_transform() -> void:
	if not OS.has_feature("JavaScript"):
		return
	if player == null:
		return
	JavaScriptBridge.eval(
	"window.MercNet.move(%s,%s,%s)" % [
		str(player.global_position.x),
		str(player.global_position.y),
		str(player.rotation)
	]
)

# ---------- auth + storage ----------

func _load_auth() -> void:
	if FileAccess.file_exists(AUTH_PATH):
		var f := FileAccess.open(AUTH_PATH, FileAccess.READ)
		if f:
			var txt := f.get_as_text()
			var data = JSON.parse_string(txt)
			if typeof(data) == TYPE_DICTIONARY:
				jwt = str(data.get("jwt", ""))
				user_id = str(data.get("userId", ""))
				return
	jwt = ""
	user_id = ""

func _save_auth() -> void:
	var data := {"jwt": jwt, "userId": user_id}
	var f := FileAccess.open(AUTH_PATH, FileAccess.WRITE)
	if f:
		f.store_string(JSON.stringify(data))

func _make_guest_id() -> String:
	return "guest_%s_%d" % [str(Time.get_unix_time_from_system()), randi() % 100000]

func login_guest_user() -> void:
	if user_id == "":
		user_id = _make_guest_id()

	var body := {"userId": user_id, "name": "Guest User"}
	var headers := ["Content-Type: application/json"]
	var json_body := JSON.stringify(body)

	var http := HTTPRequest.new()
	add_child(http)
	http.request_completed.connect(_on_login_response)

	print("Sent dev-login for:", user_id)
	http.request(api_base + "/auth/dev-login", headers, HTTPClient.METHOD_POST, json_body)

func _on_login_response(_result: int, response_code: int, _headers: PackedStringArray, body: PackedByteArray) -> void:
	print("Login response_code:", response_code)
	if response_code != 200:
		push_error("Login failed, code %s" % response_code); return

	var parsed = JSON.parse_string(body.get_string_from_utf8())
	if typeof(parsed) != TYPE_DICTIONARY:
		push_error("Could not parse login JSON"); return

	jwt = str(parsed.get("token", ""))
	if jwt == "":
		push_error("No token in response"); return

	print("Got JWT:", jwt.left(32), "... for", user_id)
	_save_auth()
	join_city_room()

# ---------- room join + snapshots ----------

func join_city_room() -> void:
	if jwt == "":
		push_error("No JWT yet, can't join room."); return

	if OS.has_feature("JavaScript"):
		# pass token + user_id into the bridge join
		var js = "window.MercNet.join('%s','%s')" % [jwt, user_id]
		var ok = JavaScriptBridge.eval(js, true)
		if ok:
			# register snapshot callback
			JavaScriptBridge.eval("window.MercNet.onPlayers('_snapshot_from_js')")
			print("Joined 'city' via JS bridge as ", user_id)
		else:
			push_error("Bridge join failed")
	else:
		# Editor/Desktop path (no JS bridge). We'll add native client later.
		print("Non-web build: skipping bridge join for now.")

# Called by JS bridge with a JSON array of players (excluding local is fine)
# [{ id, x, y, rot, name }, ...]
func _snapshot_from_js(json: String) -> void:
	var arr = JSON.parse_string(json)
	if typeof(arr) != TYPE_ARRAY:
		return
	# TODO: you can spawn/update remote avatars here.
	# For now, just log first item occasionally:
	# print("Remote snapshot (count=", arr.size(), ")")
