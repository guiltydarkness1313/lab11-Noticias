let express = require('express');
let bodyParser=require('body-parser');
let noticia=require('./models/noticia');
let app = express();

// view engine setup
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'jade');



//rutas de CRUD
app.get('/',noticia.show);
app.get('/news',noticia.show);
app.get('/news_listar',noticia.show);
app.post('/news_crear',noticia.create);
app.get('/news_crear',(req,res)=>{
  res.render('new');
});
app.get('/admin',noticia.admin);
app.get('/news',noticia.show);
app.get('/news_update',noticia.show);
app.post('/news_update',noticia.update);
app.get('/news_delete',noticia.delete);
app.get('/news_detail',noticia.detail);
app.post('/comment_create',noticia.createComment);
app.get('/comment_delete',noticia.deleteComment);
app.listen(1313,()=>{
  console.log("Start!!");
});