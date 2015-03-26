/**
 * Created by liufyi on 15-3-11.
 */
/**
 * 将字符串转换成Date对象。
 * 格式为:yyyy-MM-dd 或者 yyyy-MM-dd HH:mm:ss
 * @param str :日期格式字符串
 * @describe 可以是这样"2015xxxx03xxxx01","xxxx"只要不是数字就可以
 * 1.call parse("2015xx 3 xx 11")/parse("2015年3月11") ->return Date对象
 * 1.call parse("2015xx 3 xx 11 23:59:59")/parse("2015年3月11日23时59分59秒") ->return Date对象
 * @returns Date
 */
function parse(str)
{
    var date=str.split(/\D+/);
    if(date.length >3)
        return new Date(date[0],date[1]-1,date[2],date[3],date[4],date[5]);
    return new Date(date[0],date[1]-1,date[2]);
}
/**
 * 日期格式化
 * @author liufyi  15-3-11.
 * @param dateOrStr :Date对象 或 日期毫秒 或 日期字符串
 * @param format (可选)：y+(年) M+(月) d+(日) H+(24时制) h+(12时制) s+(秒) S+(毫秒) q+(季度)
 * 默认："yyyy-MM-dd HH:mm:ss"
 * @describe 假设当前时间="2015-03-11 17:20:59.999"
 * 值 < 10 补零(除了y+)
 * 1.call dateFormat("2015-3-1,"MM月dd日") ->return "03月01日"
 * ==================
 * 值 < 10 不补零(除了y+)
 * 2.call dateFormat("2015-3-1,"M月d日") ->return "3月1日"
 * ==================
 * 12小时制:hh
 * 3.call dateFormat("2015-03-11 17:20:59","hh点mm分钟") ->return "05点20分钟"
 * ==================
 * 季度
 * 3.call dateFormat("2015-03-11 17:20:59","第qq季度") ->return "第01季度"
 * （3月份是第1季度,两个qq表示 季度值<10补"0"="01"）
 * ==================
 * tips:除y+,从M+ ..到.. q+单个字母的时候，表示 x=x<10?"0"+x:x;
 * "x"表示M+ ..到.. q+，如：当月份值x,x <10 ,x="0"+x,其他的依次类推
 * @returns string
 */
function dateFormat(dateOrStr,format)
{

    var date=dateOrStr;
    //参数类型判断
    if(date instanceof Number)
        date=new Date(date);
    if(date instanceof Date)
        date=date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "
        +date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()+"."+date.getMilliseconds();
    date= date.split(/\D+/);
    var data =
    {
        //年、月、日
        "y+":date[0],"M+":date[1], "d+": date[2],
        //时(12&24)、分、秒
        "H+": date[3],"h+": date[3],"m+": date[4], "s+": date[5],
        //1~3 4~6 7~9 10~12 季度
        "q+": date[1]?(parseInt(date[1]) + 2)/ 3:null,
        "S+": date[6] //毫秒
    };
    var h=parseInt(data["h+"]);
    format=format?format:"yyyy-MM-dd HH:mm:ss";
    if(/(y+)/i.test(format))
        format=format.replace(RegExp.$1,data["y+"].slice(-RegExp.$1.length));
    if(/(h+)/.test(format))
        data["h+"]=h > 12?h%12:h;
    var temp;
    //值 < 10 补0到前面，年份不用补
    for(var reg in data)
    {
        temp = data[reg];
        if(reg=="y+")
            continue;
        if(!temp)
            continue;
        temp=parseInt(temp);
        temp=temp<10?"0"+temp:temp;
        if(new RegExp("("+reg+")").test(format))
            format=format.replace(RegExp.$1,RegExp.$1.length >1?temp:parseInt(temp));
    }
    return format;
}
/**
 * 获取今天 或 前几天 或 后几天。返回一个Date对象
 * @param num :可选，默认num=0即今天，-num代表前几天，+num代表后几天
 * @describe 假设今天为 xxxx年5-20
 *1.call getDate()/getDate(0) ->return 当前天Date对象（即今天5-20），相当于new Date()
 *2.call getDate(-3) ->返回前3天的Date对象（即5-17）
 *3.call getDate(3) ->返回后3天的Date对象（即5-20）
 * tips：小时、分钟、毫秒与当前时刻是一样的，无论前、后几天
 * @returns Date
 */
function getDate(num)
{
    var date=new Date(),currnt=date.getDate();
    date.setDate(currnt+(num?num:0));
    return date;
}
/**
 * 获取某个月的最后一天，即最大天数.返回的是一个Date类型。
 * @param dateOrStr ：Date对象 或 日期格式字符串（如："2013-2"）,可为空。默认获取当前月的最大天数
 * @describe dateOrStr也可以只写月份如"05" 或 5,表示获取当前年的某个月份。
 * 1.call getLast() -> return 当前年,当前月的最大天数Date对象
 * 2.cal getLast("5")/getLast("05")/getLast(5) ->retunr 当前年,5月份的最大天数Date对象
 * 3.cal getLast("2015-05")/getLast("2015-05-25 ....")->retunr 当前年,5月份的最大天数Date对象
 * 4.cal getLast(new Date()) ->return 当前Date对象内月份的最大天数
 * @returns Date
 */
function getLast(dateOrStr)
{
    var date=new Date(),
        year=date.getFullYear(),month=date.getMonth()+1;
    date.setDate(1);
    if(dateOrStr instanceof Date)
    {
        var temp=dateOrStr;
        year=temp.getFullYear;
        month=temp.getMonth()+1;
    }
    if(typeof dateOrStr=="string")
    {
        var datas=dateOrStr.split(/\D+/);
        if(datas.length > 1)
        {
            year=parseInt(datas[0]);
            month=parseInt(datas[1]);
        }
    }
    if(/^\d{1,2}$/.test(dateOrStr+""))
        month=parseInt(dateOrStr);
    date.setFullYear(year);
    date.setMonth(month);
    date.setDate(0);
    return date;
}
function timeUtil(){};
timeUtil.prototype=
{
    say:function()
    {
        alert("hello");
    }
}