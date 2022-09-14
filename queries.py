import connection

def register_user(username, password):
    return connection.execute_insert("""
    INSERT INTO user_data (name, password)
    values (%(un)s, %(psw)s)
    """, {'un': username, 'psw':password})


def get_user_password(username):
    return connection.execute_select("""
    SELECT password from user_data
    WHERE name = %(usr)s
    """, {'usr': username})
