const Notify = require("../model/notify");


const notifyCtrl = {
    getNotifyList: async (req, res) => {
        try {
            const notifys = await Notify.find({
                user: req.user._id,
            });
            res.status(200).json({ status: 0, msg: "success", notifys });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }
    ,
    
    readNotify: async (req, res) => {
        try {
            const notify = await Notify.findById(req.params.id);
            if (!notify) {
                return res.status(404).json({ msg: "notify not found" });
            }
            notify.isRead = true;
            await notify.save();
            res.status(200).json({ status: 0, msg: "success" });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }
};

module.exports = notifyCtrl;
