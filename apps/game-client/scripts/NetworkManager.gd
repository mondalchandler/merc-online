extends Node

var jwt: String = ""
var api_base: String = "http://localhost:2567"

func _ready() -> void:
	print("NetworkManager ready")
	# Optional: automatically try to login on scene start
	login_dev_user()


func login_dev_user() -> void:
	var body := {
		"userId": "dev-user-1",
		"name": "Dev User"
	}

	var headers := ["Content-Type: application/json"]
	var json_body := JSON.stringify(body)

	var http := HTTPRequest.new()
	add_child(http)

	# connect BEFORE making the request (safer in editor runs)
	http.request_completed.connect(_on_login_response)

	print("Sent dev-login...")
	http.request(
		api_base + "/auth/dev-login",
		headers,
		HTTPClient.METHOD_POST,
		json_body
	)


func _on_login_response(result: int, response_code: int, headers: PackedStringArray, body: PackedByteArray) -> void:
	print("Login response_code:", response_code)

	if response_code != 200:
		push_error("Login failed, code %s" % response_code)
		return

	var text: String = body.get_string_from_utf8()
	var parsed = JSON.parse_string(text)

	if parsed == null:
		push_error("Could not parse login JSON")
		return

	# parsed is a Dictionary like { "token": "..." }
	jwt = parsed["token"]
	print("Got JWT:", jwt.left(32), "...")

	join_city_room()


func join_city_room() -> void:
	if jwt == "":
		push_error("No JWT yet, can't join room.")
		return

	# This is where we’ll eventually open a WebSocket to join the Colyseus "city" room.
	# For now we just prove we have auth and can proceed.
	print("Would now attempt to join 'city' with JWT:", jwt.left(32), "...")
