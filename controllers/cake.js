const Cake = require('../models/cake')
const io = require('../socket');


exports.addCake = (req, res, next) => {
    if(req.multerError!==undefined){
        res.status(422);
        next(req.multerError);
    }
    const title = req.body.title;
    const comment = req.body.comment;
    const yumFactor = JSON.parse(req.body.yumFactor);
    const creator = res.userData.id;

    const protocol = req.protocol;
    const host = req.get('host');
    const filename = req.file.filename;
    const imagePath = `${protocol}://${host}/images/${filename}`;


    const newCake = new Cake({
        title: title,
        comment: comment,
        imagePath: imagePath,
        yumFactor: yumFactor,
        creator: creator
    });

    newCake.save()
        .then(cake=>{
            const resCake = {
                id: cake._id, 
                title: cake.title, 
                imagePath: cake.imagePath, 
                yumFactor: cake.yumFactor,
                creator: cake.creator
            }
            

            io.getIO().emit('cake');
            
            res.status(200).json({
                message: "SUCCESS: CAKE CREATED!",
                cake: resCake
            })
        })
        .catch(err=>{
            res.status(500);
            next(err);
        })
}




exports.getCakes = async (req, res,next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.currentpage;
    try {
        const cakes = await Cake.find({})
        .skip((pageSize * currentPage) - pageSize)
        .limit(pageSize);
        const resCakes = [...cakes].map(x=>{ 
            return {id:x._id, title:x.title, comment:x.comment,imagePath:x.imagePath, yumFactor:x.yumFactor, creator:x.creator}
        });
        const count = await Cake.countDocuments();
        res.status(200).json({
            message: "CAKES RETRIEVED",
            cakes:resCakes,
            count: count
        })
    } catch (error) {
        res.status(500);
        next(error);
    }
}

exports.editCake = (req, res, next)=> {
    if(req.multerError!==undefined){
        res.status(422);
        next(req.multerError);
    }
    
    const id = req.params.id;
    console.log(id);
    const title = req.body.title;
    const comment = req.body.comment;
    const yumFactor = JSON.parse(req.body.yumFactor);
    let imagePath;
        if(req.file!==undefined){
            const protocol = req.protocol;
            const host = req.get('host');
            const name = req.file.filename;
            imagePath = `${protocol}://${host}/images/${name}`;
        }
        else{
            imagePath = req.body.imagePath;
        }
    const userId = res.userData.id;
    const creator = req.body.creator;

    if(userId===creator){
        Cake.findByIdAndUpdate(id, {title:title, comment:comment, imagePath:imagePath, yumFactor:yumFactor})
        .then(cake=>{
            if(cake){
                io.getIO().emit('cake');
                res.status(202).json({
                    message:`CAKE WITH ${id} UPDATED!`
                });
            }
            else{
                res.status(404).json({
                    message: "NO SUCH CAKE!"
                })
            }
        })
        .catch(err=>{
            next(err);
        });
    }
    else{
        res.status(401).json(
            {message:"YOU ARE UNAUTHORIZED!"
        });
    }
   
}

exports.deleteCake = (req, res, next) => {
    const id = req.params.id;
    const userId = res.userData.id;

    Cake.findOne({_id : id})
        .then(cake=>{
            if(cake){
                if(cake.creator.toString()===userId){
                    Cake.findByIdAndDelete(id)
                        .then(cake=>{
                            io.getIO().emit('cake');
                            res.status(200).json({
                                message: `CAKE WITH ${id} SUCCESSFULLY DELETED`
                            })
                        })
                        .catch(err=>{
                            res.status(500)
                            next(err);
                        })
                }
                else{
                    res.status(403).json({
                        message:"YOU ARE UNAUTHORIZED!"
                    });
                }
            }
            else{
                res.status(404).json({
                    message: "NO SUCH CAKE!"
                })
            }
        })
        .catch(err=>{
            res.status(500);
            next(err);
        })
}


exports.getCake = async (req, res, next) => {
    let id = req.params.id;
    try{
        const cake = await Cake.findOne({_id:id});
        const resCake = [cake].map(x=>{return {id:x._id, title:x.title, comment:x.comment,imagePath:x.imagePath, yumFactor:x.yumFactor, creator:x.creator}})[0];
        if(cake){
            res.status(200).json({
                message: `CAKE WITH ${id} RETRIEVED SUCCESSFULLY`,
                cake: resCake
            })
        }
        else{
            res.status(404).json({
                message: "CAKE NOT FOUND"
            })
        }
    }
    catch(err){
        res.status(500);
        next(err);
    }

    
}

