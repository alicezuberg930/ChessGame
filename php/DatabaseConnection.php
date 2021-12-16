<?php
const HOST = "localhost";
const USERNAME = "root";
const PASSWORD = "";
const DATABASE = "chess";

function connect()
{
    $connect = mysqli_connect(HOST, USERNAME, PASSWORD, DATABASE);
    mysqli_set_charset($connect, "utf8");
    if ($connect->error) {
        die("Connection to the server failed");
    }
    return $connect;
}

function Query($sql)
{
    $connect = connect();
    $result = mysqli_query($connect, $sql);
    $connect->close();
    return $result;
}
