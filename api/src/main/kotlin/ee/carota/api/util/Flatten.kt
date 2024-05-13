package ee.carota.api.util

fun Map<*, *>.flatten(): Map<String, Any> {
    val result = mutableMapOf<String, Any>()

    flattenMapTo(result, this, "")

    return result
}

private fun flattenListTo(destination: MutableMap<String, Any>, list: List<*>, prefix: String) {
    for ((index, value) in list.withIndex()) {
        flattenValueTo(destination, "$prefix$index", value)
    }
}

private fun flattenMapTo(destination: MutableMap<String, Any>, map: Map<*, *>, prefix: String) {
    for ((key, value) in map) {
        flattenValueTo(destination, "$prefix$key", value)
    }
}

private fun flattenValueTo(destination: MutableMap<String, Any>, key: String, value: Any?) {
    when (value) {
        null -> return
        is Map<*, *> -> flattenMapTo(destination, value, "$key.")
        is List<*> -> flattenListTo(destination, value, "$key.")
        else -> destination[key] = value
    }
}
