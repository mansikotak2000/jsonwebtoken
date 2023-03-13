let r=prompt("Enter no. of rows for input");
let c=prompt("Enter no. of columns for input");
document.write('<table border="1">');
for(var i=0;i<r;i++)
{
    for(var j=0;j<c;j++)
    {
        if(j==0)
        {
            document.write('<tr>');
        }
        document.write('<td>mk</td>')
        if(j==c)
        {
            document.write('</tr>')
        }
    }
   
}
document.write('</table>');