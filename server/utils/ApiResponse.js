/**
 * Standard success response shape used by every controller:
 * { success, statusCode, message, data, meta }
 */
class ApiResponse {
  constructor(statusCode, message = "Success", data = null, meta = undefined) {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    if (meta) this.meta = meta;
  }
}

module.exports = ApiResponse;
