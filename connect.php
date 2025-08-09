<?php
$username=$_POST['username'];
$email=$_POST['email'];
$password=$_POST['password'];

$conn=new mysqli('localhost','root','','login page');
if($conn->connect_error){
    die('Connection Failed: '.$conn->connect_error);
else{
    $stmt=$conn->prepare("Inser into login(username, email, password) values(?, ?, ?)");
    $stmt->bind_param("sss",$username, $email, $password);
    $stmt->execute();
    echo "Logged in successfully...";
    $stmt->close();
    $conn->close();
}
}