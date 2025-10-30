let _cityRoom: any = null;
export function setCityRoomRef(room: any) { _cityRoom = room; }
export function clearCityRoomRef(room: any) { if (_cityRoom === room) _cityRoom = null; }
export function getCityRoomRef() { return _cityRoom; }
