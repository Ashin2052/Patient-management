const express = require('express');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'ashincloud',
    api_key: '877698598293121',
    api_secret: 'ZfKD9BhAZJ7mWWTO-idJP3knmeo',
});
module.exports = cloudinary;
