
var ListField = [];   //Mảng các cột của bảng dùng để Gen Code
var ProjectName = $('#ProjectName').val(); //Tên của project sẽ dùng để Gen Code và tạo ra file
var Screen = $('#ScreenName').val();  //Tên của màn hình sẽ dùng để Gen Code và tạo ra file

/*-- Hàm RegEx để cắt và lấy ra các trường --*/
function GetFields() {
    ProjectName = $('#ProjectName').val(); 
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
    $("#resultIService").text(GenCode_IService());
    //$("#resultInterface").text(GenCode_Interface());
    //$("#resultView_Index").text(GenCode_View_Index());
    //$("#resultView_Detail").text(GenCode_View_Detail());
        
    /*---Hiển thị màu của các đoạn code đã lấy được---*/
    $('pre code').each(function (i, block) {
        hljs.highlightBlock(block);
    });
}

function GenCode_Controller(){
    var strController = 'using System.ComponentModel.DataAnnotations;\n' +
                        'using System.Threading.Tasks;\n' +
                        'using app.Core.Models;\n' +
                        'using app.Core.Utils;\n' +
                        'using Microsoft.AspNetCore.Authorization;\n' +
                        'using Microsoft.AspNetCore.Mvc;\n' +
                        'using stepwatch.Api.Controllers.Base;\n' +
                        'using stepwatch.Api.Infrastructure;\n' +
                        'using stepwatch.Api.Services.Interface;\n' +
                        '\n' +
                        'namespace ' + ProjectName +'.Controllers\n' +
                        '{\n' +
                        '    public class ' + Screen + 'Controller : BaseController\n' +
                        '    {\n' +
                        '         private readonly I' + Screen + 'Service _' + lowercaseFirstLetter(Screen) + 'Service;\n' +
                        '\n' +
                        '         public ' + Screen + 'Controller(I' + Screen + 'Service ' + lowercaseFirstLetter(Screen) + 'Service)\n' +
                        '         {\n' +
                        '            _' + lowercaseFirstLetter(Screen) + 'Service = ' + lowercaseFirstLetter(Screen) + 'Service;\n' +
                        '         }\n' +
                        '\n' +
                        '         [HttpGet("mydata")]\n' +
                        '         public async Task<OkResponse> GetMyDatas()\n' +
                        '         {\n' +
                        '           ' + ' var result = _I' + lowercaseFirstLetter(Screen) + 'Service.GetMyDatas();\n' +
                        '            return new OkResponse();\n' +
                        '         }\n' +
                        '    }\n' +
                        '}\n' +
                        '\n';
    return strController;
}

function GenCode_IService() {
    var strRepository = 'using System;\n' +
                        'using System.Threading.Tasks;\n' +
                        'using System.Collections.Generic;\n' +
                        '\n' +
                        'namespace ' + ProjectName +'.Controllers\n' +
                        '{\n'+
                        '     public interface ' + 'I' + Screen + 'Service\n' +
                        '     {\n' +
                        '       ' + ' Task\n' +
                        '     }\n' +
                        '}\n'; +
                        '\n';
    return strRepository;
}

function GenCode_Service(){
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

// Viết thường chữ cái đầu
function lowercaseFirstLetter(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
  }
