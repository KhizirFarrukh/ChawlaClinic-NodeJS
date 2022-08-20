import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
public class TokenPrinting {
  public static void main(String[] args) {
    TokenPrinting obj = new TokenPrinting();
    String PType = args[0];
    String TokenNum = args[1];
    String PrinterName = args[2];
    obj.PrintToken(PType,TokenNum,PrinterName);
  }
  private String GetSystemTime()
  {
    DateTimeFormatter dtf = DateTimeFormatter.ofPattern("hh:mm a, dd/MM/yyyy");
    LocalDateTime now = LocalDateTime.now();
    String TimeDateString = dtf.format(now);
    return TimeDateString;
  }
  private void PrintToken(String PatientType, String TokenNumber, String PrinterName)
  {
    PrinterService printerService = new PrinterService();
    String TimeDateString = GetSystemTime();
    byte[] justify1 = new byte[] { 0x1b, 0x61, 49};
    byte[] fSize1 = new byte[] { 0x1d, '!', 35 };
    byte[] fSize2 = new byte[]{ 0x1d, '!', 17 };
    byte[] fSize4 = new byte[] { 0x1d, '!', 51 };
    byte[] fSize5 = new byte[] { 0x1d, '!', 0 };
    byte[] cutP = new byte[] { 0x1d, 'V', 1 };
    String justify1Str = new String(justify1);
    String fSize1Str = new String(fSize1);
    String fSize2Str = new String(fSize2);
    String fSize4Str = new String(fSize4);
    String fSize5Str = new String(fSize5);
    String cutPStr = new String(cutP);
    String ChawlaClinicName = "CHAWLA CLINIC";
    String TimeDate_PTypeToken = "\n" + TimeDateString + "\n" + "________________________\n\n" + PatientType + " TOKEN NUMBER\n";
    String HorizontalLine = "________________________\n\n";
    String Footer = "\n\n\n\n\n\nSOFTWARE DEVELOPED BY KHIZIR FARRUKH\nEMAIL: khizirfarrukh@outlook.com\n\n\n\n\n";
    String FullString = justify1Str + fSize1Str + ChawlaClinicName + fSize2Str + TimeDate_PTypeToken + HorizontalLine + fSize4Str + TokenNumber + fSize5Str + Footer + cutPStr;
    printerService.printString(PrinterName, FullString);
  }
}
