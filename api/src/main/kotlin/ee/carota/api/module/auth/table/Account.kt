package ee.carota.api.module.auth.table

import org.jetbrains.exposed.dao.id.LongIdTable
import org.jetbrains.exposed.sql.javatime.timestamp

object Account : LongIdTable("auth.account") {
    val publicId = varchar("public_id", 12).uniqueIndex()
    val email = varchar("email", 255).uniqueIndex()
    val passwordHash = char("password_hash", 60)
    val createTime = timestamp("create_time")
    val updateTime = timestamp("update_time")
}
