exports.getPrivateData = (req, res, next) => {
    res.status(200).json({
        sucess: true,
        data: "You have got the access to the data in this route"
    });
}