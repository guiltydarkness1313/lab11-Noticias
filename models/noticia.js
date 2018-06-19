const mongoose = require('mongoose');
var Schema=mongoose.Schema;
mongoose.connect('mongodb://localhost/blog');

var noticia_Schema=new Schema({
    titulo:String,
    descripcion:String,
    categoria:String,
    fecha:String,
    comentarios:[{
        autor:String,
        mensaje:String,
        fecha:String
    }]
});

noticia_model=mongoose.model('noticias',noticia_Schema,'noticias');

module.exports={
    deleteComment:(req,res)=>{
        let _id_original=req.query.noticia_id;
      if(req.query.noticia_id && req.query.autor && req.query.mensaje && req.query.fecha && req.query._id===false){
          let new_id=req.query.noticia_id;
          let autor=req.query.autor;
          let mensaje=req.query.mensaje;
          let fecha=req.query.fecha;
          let comentario={"autor":autor,"mensaje":mensaje,"fecha":fecha};
          noticia_model.findOneAndUpdate({_id:new_id},{"$pull":{comentarios:{comentario}}},(error,success)=>{
              if(error){
                  console.log(error);
              }else {
                  console.log(success);
                  res.redirect('/news_detail?_id='+_id_original)
              }
          });
      }
      if(req.query.noticia_id && req.query.autor && req.query.mensaje && req.query.fecha && req.query._id){
          let new_id=req.query.noticia_id;
          let autor=req.query.autor;
          let mensaje=req.query.mensaje;
          let fecha=req.query.fecha;
          let _id=req.query._id;
          let comentario={"_id":_id,"autor":autor,"mensaje":mensaje,"fecha":fecha};
          noticia_model.findOneAndUpdate({_id:new_id},{$pull:{comentarios:{comentario}}},(error,success)=>{
              if(error){
                  console.log(error);
              }else {
                  console.log(success);
                  res.redirect('/news_detail?_id='+_id_original)
              }
          });
      }
      else{
          console.log("ERROR AL BORRAR COMENTARIO");
          res.redirect('/news_detail?_id='+_id_original);
      }
    },
    createComment:(req,res)=>{
        if(req.body.autor && req.body.mensaje){
            let autor=req.body.autor;
            let mensaje=req.body.mensaje;
            var today= new Date();
            var dd=today.getDate();
            var mm=today.getMonth()+1;
            var yyyy=today.getFullYear();
            if(dd<10){
                dd='0'+dd;
            }
            if(mm<10){
                mm='0'+mm;
            }
            let fecha=yyyy+"-"+mm+"-"+dd;

            var comentario={"autor":autor,"mensaje":mensaje,"fecha":fecha};
            noticia_model.findOneAndUpdate({_id:req.query._id},{$push:{"comentarios":comentario}},(error,success)=>{
                if(error){
                    console.log(error);
                }else {
                    console.log(success);
                    res.redirect('/news_detail?_id='+req.query._id)
                }
            });
        }
    },
    detail:(req,res)=>{
        noticia_model.findById({_id:req.query._id},(error,items)=>{
            if(!error){
                //console.log(items);
                //res.send(items);
                res.render("news-detail",{item:items})
            }else{
                return console.log(error);
            }
        });
    },
    admin:(req,res)=>{
      if(req.query._id==null){
          noticia_model.find({},(error,items)=>{
              if(!error){
                  res.render('admin',{data:items});
              }
          })
      }
    },
    show:(req,res)=>{
        if(req.query._id==null){
            noticia_model.find({},(error,items)=>{
                if(!error){
                    res.render('noticias',{data:items});
                    //res.send(items);
                    console.log(items);
                }else{
                    return console.log(error);
                }
            });
        }else{
            console.log(req.query._id);
            noticia_model.findById({_id:req.query._id},(error,items)=>{
                if(!error){
                    console.log(items);
                    //res.send(items);
                    res.render("detalle",{data:items})
                }else{
                    return console.log(error);
                }
            });
        }
    },
    create:(req,res)=>{
        if(req.body.titulo && req.body.descripcion
            && req.body.categoria && req.body.fecha){
            let item={
                titulo:req.body.titulo,
                descripcion:req.body.descripcion,
                categoria:req.body.categoria,
                fecha:req.body.fecha
            };
            let nuevo = new noticia_model(item).save();
            console.log(nuevo);
            res.redirect('/admin');
        }else{
            console.log("no se puede crear una noticia vacia");
            res.redirect("/admin");
        }
    },
    update:(req,res)=>{
        noticia_model.findOne({_id:req.query._id},(error,noticia)=>{
            noticia.titulo=req.body.titulo;
            noticia.descripcion=req.body.descripcion;
            noticia.categoria=req.body.categoria;
            noticia.fecha=req.body.fecha;
            noticia.save();
            res.redirect("/admin");
        });
    },
    delete:(req,res)=> {
        noticia_model.findOne({_id: req.query._id}, (error, noticia) => {
            noticia.remove();
            res.redirect("/admin");
        });
    }
};
