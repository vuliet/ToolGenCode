
var ListField = [];   //Mảng các cột của bảng dùng để Gen Code
var ProjectName = $('#ProjectName').val(); //Tên của project sẽ dùng để Gen Code và tạo ra file
var Screen = $('#ScreenName').val();  //Tên của màn hình sẽ dùng để Gen Code và tạo ra file
var toLowerCaseScreen = lowercaseFirstLetter(Screen);
var isAdminAPI = $('#adminApi').val();
var baseClassName = 'BaseController';
var urlRootAPI = '/api';
var admStr = '';

/*-- Hàm RegEx để cắt và lấy ra các trường --*/
function GetFields() {
    ProjectName = $('#ProjectName').val(); 
    Screen = $('#ScreenName').val();
    toLowerCaseScreen = lowercaseFirstLetter(Screen);
    isAdminAPI = $('#adminApi').val();
    baseClassName = isAdminAPI === 'true' ? 'BaseAdmController' : 'BaseController';
    urlRootAPI = isAdminAPI === 'true' ? '/admin-api' : '/api';
    admStr = isAdminAPI === 'true' ? 'Adm' : '';
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
    $("#resultService").text(GenCode_Service());
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
                        '    [Route("'+ urlRootAPI +'/v1/'+ toLowerCaseScreen +'")]\n' +
                        '    public class '+ Screen +''+ admStr +'Controller : '+ baseClassName +'\n' +
                        '    {\n' +
                        '         private readonly I' + Screen + 'Service _' + toLowerCaseScreen + 'Service;\n' +
                        '\n' +
                        '         public ' + Screen +''+ admStr +'Controller(I' + Screen + 'Service ' + toLowerCaseScreen + 'Service)\n' +
                        '         {\n' +
                        '            _' + toLowerCaseScreen + 'Service = ' + toLowerCaseScreen + 'Service;\n' +
                        '         }\n' +
                        '\n' +
                        '         [HttpGet("list")]\n' +
                        '         public async Task<OkResponse> Get' + Screen + 's()\n' +
                        '         {\n' +
                        '           ' + ' var result = _' + toLowerCaseScreen + 'Service.Get' + Screen + 's(CurrentUser());\n' +
                        '            return new OkResponse();\n' +
                        '         }\n' +
                        '    }\n' +
                        '}\n' +
                        '\n';
    return strController;
}

function GenCode_IService() {
    var strIService = 'using System;\n' +
                        'using System.Threading.Tasks;\n' +
                        'using System.Collections.Generic;\n' +
                        '\n' +
                        'namespace ' + ProjectName +'.Service.Interface\n' +
                        '{\n'+
                        '     public interface ' + 'I' + Screen + 'Service\n' +
                        '     {\n' +
                        '       ' + ' Task<List<'+ Screen +'Dto>> Get' + Screen + 's(AppUser appUser);\n' +
                        '       ' + ' Task<TableResult<'+ Screen +'Dto>> AdmGet' + Screen + 's(TableRequest request);\n' +
                        '       ' + ' Task AdmImport' + Screen + 's(List<'+ Screen +'Dto> requests, AppUser appUser);\n' +
                        '       ' + ' Task AdmCreate' + Screen + '('+ Screen +'Dto request, AppUser appUser);\n' +
                        '       ' + ' Task AdmUpdate' + Screen + '('+ Screen +'Dto request, AppUser appUser);\n' +
                        '     }\n' +
                        '\n';
    return strIService;
}

function GenCode_Service(){
    var strService =  'using System;\n' +
                        'using System.Collections.Generic;\n' +
                        'using System.Linq;\n' +
                        '\n' +
                        'namespace ' + ProjectName +'.Service.Implement\n' +
                        '{\n' +
                        '     public class ' + Screen + 'Service : I'+ Screen + 'Service\n' +
                        '     {\n' +
                        '          private readonly LogManager _logManager;\n' +
                        '\n' +
                        '          public ' + Screen + 'Service(LogManager logManager)\n' +
                        '          {\n' +
                        '              _logManager = logManager;\n' +
                        '          }\n' +
                        '\n' +
                        '          public async Task<List<'+ Screen +'Dto>> Get' + Screen + 's(AppUser appUser)\n' +
                        '          {\n' +
                        '              await using var dbConnection = new MySqlConnection(Configurations.DbConnectionString);\n' +
                        '              await dbConnection.OpenAsync();\n' +
                        '\n' +
                        '              var '+ Screen +'Dtos = (await dbConnection.QueryAsync<'+ Screen +'Dto>(\n' +
                        '               @"SELECT * FROM '+ Screen +'s", new {})).ToList();\n' +
                        '\n' +
                        '               return '+ Screen +'Dtos;\n' +
                        '          }\n' +
                        '\n' +
                        '          public async Task<TableResult<'+ Screen +'Dto>> AdmGet'+ Screen +'s(TableRequest request)\n' +
                        '          {\n' +
                        '              var builder = new SqlBuilder();\n' +
                        '\n' +
                        '              var (counter, selector) = builder.Build(typeof('+ Screen +'Dto), "'+ Screen +'s", request,\n' +
                        '              new Dictionary<string, string>\n' +
                        '              {\n' +
                        '                 {"Id", "long"}\n' +
                        '              }, null,\n' +
                        '              new[] { "Id" });\n' +
                        '\n' +
                        '              await using var dbConnection = new MySqlConnection(Configurations.DbConnectionString);\n' +
                        '              await dbConnection.OpenAsync();\n' +
                        '\n' +
                        '              var total = await dbConnection.ExecuteScalarAsync<int>(\n' +
                        '                  counter.RawSql, counter.Parameters);\n' +
                        '\n' +
                        '              var items = (await dbConnection.QueryAsync<'+ Screen +'Dto>(\n' +
                        '                  selector.RawSql, selector.Parameters)).ToList();\n' +
                        '\n' +
                        '              return new TableResult<'+ Screen +'Dto>(items, total, request);\n' +
                        '          }\n' +
                        '\n' +
                        '          public async AdmImport' + Screen + 's(List<'+ Screen +'Dto> requests, AppUser appUser)\n' +
                        '          {\n' +
                        '              foreach (var request in requests)\n' +
                        '              {\n' +
                        '                  await AdmCreate' + Screen + '(request, appUser)\n' +
                        '              }\n' +
                        '          }\n' +
                        '\n' +
                        '          public async AdmCreate' + Screen + '('+ Screen +'Dto request, AppUser appUser)\n' +
                        '          {\n' +
                        '              await using var dbConnection = new MySqlConnection(Configurations.DbConnectionString);\n' +
                        '              await dbConnection.OpenAsync();\n' +
                        '\n' +
                        '              request.CreatedTime = AppUtils.NowMilis();\n' +
                        '              var exec = await dbConnection.ExecuteAsync(\n' +
                        '                  @"INSERT INTO '+ Screen +'s(`CreatedTime`)\n' +
                        '                  VALUES(@CreatedTime)", request);\n' +
                        '              if (exec != 1)\n' +
                        '              {\n' +
                        '                  Log.Error($"create record '+ Screen +' fail={JsonConvert.SerializeObject(request)}");\n' +
                        '                  continue;\n' +
                        '              }\n' +
                        '\n' +
                        '              await _logManager.LogAdmin(appUser.Id, "create data '+ Screen +'","");\n' +
                        '          }\n' +
                        '\n' +
                        '          public async AdmUpdate' + Screen + '('+ Screen +'Dto request, AppUser appUser)\n' +
                        '          {\n' +
                        '              await using var dbConnection = new MySqlConnection(Configurations.DbConnectionString);\n' +
                        '              await dbConnection.OpenAsync();\n' +
                        '\n' +
                        '              request.UpdatedTime = AppUtils.NowMilis();\n' +
                        '              var exec = await dbConnection.ExecuteAsync(\n' +
                        '                  @"UPDATE '+ Screen +'s()\n' +
                        '                  SET UpdatedTime = @UpdatedTime WHERE Id = @Id", request);\n' +
                        '              if (exec != 1)\n' +
                        '              {\n' +
                        '                  Log.Error($"update record '+ Screen +' fail={JsonConvert.SerializeObject(request)}");\n' +
                        '                  continue;\n' +
                        '              }\n' +
                        '\n' +
                        '              await _logManager.LogAdmin(appUser.Id, "update data '+ Screen +'","");\n' +
                        '          }\n' +
                        '     }\n' +
                        '}\n';
    return strService;
}

function DownloadAll() {
    /*-- Preview trước khi download (phòng trường hợp click download mà chưa preview) --*/
    Preview();
    /*-- Dùng hàm setTimeout() để lần lượt tạo file và download về, nếu không các file sẽ bị trùng tên, đè lên nhau --*/
    setTimeout(() => {
        download(Screen + 'Controller.cs', GenCode_Controller());  //Chỗ này ta tạo 1 file có đuôi là ".cs"
    }, 1000);
    setTimeout(() => {
        download(Screen + 'IService.cs', GenCode_IService());
    }, 2000);
    setTimeout(() => {
        download('I'+Screen + 'Service.cs', GenCode_Service());
    }, 3000);
    // setTimeout(() => {
    //     download('Index.cshtml', GenCode_View_Index());    //Chỗ này ta tạo 1 file có đuôi là ".cshtml".
    // }, 4000);
    // setTimeout(() => {
    //     download('Detail.cshtml', GenCode_View_Detail());
    // }, 5000);
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
