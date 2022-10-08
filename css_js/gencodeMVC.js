
var ListField = [];   //Mảng các cột của bảng dùng để Gen Code
var Screen = $('#ScreenName').val();  //Tên của màn hình sẽ dùng để Gen Code và tạo ra file

    /*-- Hàm RegEx để cắt và lấy ra các trường --*/
function GetFields() {
    Screen = $('#ScreenName').val();
    ListField = [];
    const regex = /public .* (\w+) { get; set; }/g;
    var str= $("#InputModel").val(); //Chuỗi Model dùng để cắt các trường, được lấy từ một html input tự nhập.
    let m;
    while ((m = regex.exec(str)) !== null) {  //Lặp lại quá trình so khớp chuỗi regex với chuỗi str để tìm group phù hợp
        var matches = [];
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        m.forEach((match, groupIndex) => {
            matches.push(`${match}`); //Tìm được các Group match thì lưu lại vào mảng
        });
        ListField.push(matches[1]); //Ở đây ta cần lấy Group1 (Tương đương $1) để lưu lại vào mảng ListField
    }
}

function Preview() {
    /*-- Sử dụng RegEx để cắt và lấy ra các trường (cột) lưu vào mảng ListField --*/
    GetFields();
    /*-- Bắt đầu ghép chuỗi từ 2 thông tin là TÊN BẢNG (ScreenName) và DANH SÁCH CÁC CỘT (ListField) --*/
    $("#resultController").text(GenCode_Controller());
    $("#resultRepository").text(GenCode_Repository());
    $("#resultInterface").text(GenCode_Interface());
    $("#resultView_Index").text(GenCode_View_Index());
    $("#resultView_Detail").text(GenCode_View_Detail());
        
    /*---Hiển thị màu của các đoạn code đã lấy được---*/
    $('pre code').each(function (i, block) {
        hljs.highlightBlock(block);
    });
}

function GenCode_Controller(){
    var strController = 'using System.Data;\n' +
                        'using System.Linq;\n' +
                        'using System.Web.Mvc;\n' +
                        'using ExampleStore.DAL;\n' +
                        'using ExampleStore.Models;\n' +
                        '\n' +
                        'namespace ExampleStore.Controllers\n' +
                        '{\n' +
                        '    public class ' + Screen + 'Controller : Controller\n' +
                        '    {\n' +
                        '         private I' + Screen + 'Repository _' + Screen + 'Repository;\n' +
                        '\n' +
                        '         public ' + Screen + 'Controller()\n' +
                        '        {\n' +
                        '            this._' + Screen + 'Repository = new ' + Screen + 'Repository(new ' + Screen + 'Context());\n' +
                        '        }\n' +
                        '\n' +
                        '       public ActionResult Index()\n' +
                        '        {\n' +
                        '            var ' + Screen + 's = from ' + Screen + ' in _' + Screen + 'Repository.Get' + Screen + 's()\n' +
                        '                             select ' + Screen + ';\n' +
                        '            return View(' + Screen + 's);\n' +
                        '        }\n' +
                        '\n' +
                        '       public ViewResult Details(int id)\n' +
                        '       {\n' +
                        '           ' + Screen + ' student = _' + Screen + 'Repository.Get' + Screen + 'ByID(id);\n' +
                        '           return View(student);\n' +
                        '       }\n' +
                        '\n';
    return strController;
}

function GenCode_Repository(){
    var strRepository = ' using System;\n '+
                        ' using System.Collections.Generic;\n '+
                        ' using System.Linq;\n '+
                        ' using ExampleStore.Models;\n '+
                        ' using System.Data;\n '+
                        ' \n '+
                        ' namespace ExampleStore.DAL\n '+
                        ' {\n '+
                        '     public class ' + Screen + 'Repository : I' + Screen + 'Repository\n '+
                        '     {\n '+
                        '         private ' + Screen + 'Context _context;\n '+
                        ' \n '+
                        '         public ' + Screen + 'Repository(' + Screen + 'Context ' + Screen + 'Context)\n '+
                        '         {\n '+
                        '             this._context = ' + Screen + 'Context;\n '+
                        '         }\n '+
                        ' \n '+
                        '         public IEnumerable<' + Screen + '> Get' + Screen + 's()\n '+
                        '         {\n '+
                        '             return _context.' + Screen + 's.ToList();\n '+
                        '         }\n '+
                        ' \n '+
                        '         public ' + Screen + ' Get' + Screen + 'ByID(int id)\n '+
                        '         {\n '+
                        '             return _context.' + Screen + 's.Find(id);\n '+
                        '         }\n '+
                        ' \n '+
                        '         public void Insert' + Screen + '(' + Screen + ' ' + Screen + ')\n '+
                        '         {\n '+
                        '             _context.' + Screen + 's.Add(' + Screen + ');\n '+
                        '         }\n '+
                        ' \n '+
                        '         public void Delete' + Screen + '(int ' + Screen + 'ID)\n '+
                        '         {\n '+
                        '             ' + Screen + ' ' + Screen + ' = _context.' + Screen + 's.Find(' + Screen + 'ID);\n '+
                        '             _context.' + Screen + 's.Remove(' + Screen + ');\n '+
                        '         }\n '+
                        ' \n '+
                        '         public void Update' + Screen + '(' + Screen + ' ' + Screen + ')\n '+
                        '         {\n '+
                        '             _context.Entry(' + Screen + ').State = EntityState.Modified;\n '+
                        '         }\n '+
                        ' \n '+
                        '         public void Save()\n '+
                        '         {\n '+
                        '             _context.SaveChanges();\n '+
                        '         }\n '+
                        ' \n '+
                        '         private bool disposed = false;\n '+
                        ' \n '+
                        '         protected virtual void Dispose(bool disposing)\n '+
                        '         {\n '+
                        '             if (!this.disposed)\n '+
                        '             {\n '+
                        '                 if (disposing)\n '+
                        '                 {\n '+
                        '                     _context.Dispose();\n '+
                        '                 }\n '+
                        '             }\n '+
                        '             this.disposed = true;\n '+
                        '         }\n '+
                        ' \n '+
                        '         public void Dispose()\n '+
                        '         {\n '+
                        '             Dispose(true);\n '+
                        '             GC.SuppressFinalize(this);\n '+
                        '         }\n '+
                        '     }\n '+
                        ' }\n ';
    return strRepository;
}

function GenCode_Interface(){
    var strInterface =  ' using System;\n '+
                        ' using System.Collections.Generic;\n '+
                        ' using ExampleStore.Models;\n '+
                        ' \n '+
                        ' namespace ExampleStore.DAL\n '+
                        ' {\n '+
                        '     public interface I' + Screen + 'Repository : IDisposable\n '+
                        '     {\n '+
                        '         IEnumerable<' + Screen + '> Get' + Screen + 's();\n '+
                        '         ' + Screen + ' Get' + Screen + 'ByID(int ' + Screen + 'Id);        \n '+
                        '         void Insert' + Screen + '(' + Screen + ' ' + Screen + ');        \n '+
                        '         void Delete' + Screen + '(int ' + Screen + 'ID);\n '+
                        '         void Update' + Screen + '(' + Screen + ' ' + Screen + ');\n '+
                        '         void Save();        \n '+
                        '     }\n '+
                        ' }\n ';
    return strInterface;
}

function GenCode_View_Index(){
    var template = '';
    ListField.forEach(function(item){
        template += '         <th>\n '+
                    '             @Html.DisplayNameFor(model => model.'+item+')\n '+
                    '         </th>\n '
        });
    var strView_Index = ' @model IEnumerable<ExampleStore.Models.' + Screen + '>\n '+
                        ' @{\n '+
                        '     ViewBag.Title = "Index";\n '+
                        ' }\n '+
                        ' <h2>Index</h2>\n '+
                        ' <p>\n '+
                        '     @Html.ActionLink("Create New", "Create")\n '+
                        ' </p>\n '+
                        ' <table>\n '+
                        '     <tr>\n '+
                        template + 
                        '         <th></th>\n '+
                        '     </tr>\n '+
                        ' @foreach (var item in Model) {\n '+
                        '     <tr>\n '+
                        template +
                        '         <td>\n '+
                        '             @Html.ActionLink("Edit", "Edit", new { id=item.Id }) |\n '+
                        '             @Html.ActionLink("Details", "Details", new { id=item.Id }) |\n '+
                        '             @Html.ActionLink("Delete", "Delete", new { id=item.Id })\n '+
                        '         </td>\n '+
                        '     </tr>\n '+
                        ' }\n '+
                        ' </table>\n ';
    return strView_Index;
}

function GenCode_View_Detail(){
    var template = '';
    ListField.forEach(function(item){
        template += '     <div class="display-label">\n '+
                    '          @Html.DisplayNameFor(model => model.'+item+')\n '+
                    '     </div>\n '+
                    '     <div class="display-field">\n '+
                    '         @Html.DisplayFor(model => model.'+item+')\n '+
                    '     </div>\n '
        });
    var strView_Detail =' @model ExampleStore.Models.' + Screen + '\n '+
                        ' \n '+
                        ' @{\n '+
                        '     ViewBag.Title = "Details";\n '+
                        ' }\n '+
                        ' \n '+
                        ' <h2>Details</h2>\n '+
                        ' \n '+
                        ' <fieldset>\n '+
                        '     <legend>' + Screen + '</legend>\n '+
                        ' \n '+
                        template+
                        ' </fieldset>\n '+
                        ' <p>\n '+
                        '     @Html.ActionLink("Edit", "Edit", new { id=Model.Id }) |\n '+
                        '     @Html.ActionLink("Back to List", "Index")\n '+
                        ' </p>\n ';
    return strView_Detail;
}


function DownloadAll() {
    /*-- Preview trước khi download (phòng trường hợp click download mà chưa preview) --*/
    Preview();
    /*-- Dùng hàm setTimeout() để lần lượt tạo file và download về, nếu không các file sẽ bị trùng tên, đè lên nhau --*/
    setTimeout(() => {
        download(Screen + 'Controller.cs', GenCode_Controller());  //Chỗ này ta tạo 1 file có đuôi là ".cs"
    }, 1000);
    setTimeout(() => {
        download(Screen + 'Repository.cs', GenCode_Repository());
    }, 2000);
    setTimeout(() => {
        download('I'+Screen + 'Repository.cs', GenCode_Interface());
    }, 3000);
    setTimeout(() => {
        download('Index.cshtml', GenCode_View_Index());    //Chỗ này ta tạo 1 file có đuôi là ".cshtml".
    }, 4000);
    setTimeout(() => {
        download('Detail.cshtml', GenCode_View_Detail());
    }, 5000);
}

/*-- Hàm thực thi việc tạo file (có đuôi file luôn) và download file về từ trình duyệt --*/
function download(filename, text, name) {
        var link = document.createElement('a');
        link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        link.setAttribute('download', filename);

        if (document.createEvent) {
            var event = document.createEvent('MouseEvents');
            event.initEvent('click', true, true);
            link.dispatchEvent(event);
        } else {
            link.click();
        }
}
