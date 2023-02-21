using QRCoder;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Drawing;
using System.Drawing.Printing;

namespace PrintManager
{
    class Program
    {
        [STAThread]
        static void Main(string[] args)
        {
            if (args.Length > 0)
            {
                Uri uri = new Uri(args[0]);
                string host = uri.Host;
                string query = uri.Query;

                Dictionary<string, string> queryDict = new Dictionary<string, string>();
                foreach (string keyValuePair in query.TrimStart('?').Split('&'))
                {
                    string[] keyValueArray = keyValuePair.Split('=');
                    queryDict.Add(keyValueArray[0], Uri.UnescapeDataString(keyValueArray[1].Replace("+", " ")));
                }
                PrinterManager mgr = new PrinterManager();
                if (host == "printtokennumber")
                {

                    string CaseNum = queryDict["CaseNum"];
                    string PatientType = queryDict["PatientType"];
                    string TokenNumber = queryDict["TokenNumber"];
                    string TokenDate = queryDict["TokenDate"];
                    string TokenTime = queryDict["TokenTime"];

                    dynamic tokenNumberData = new System.Dynamic.ExpandoObject();
                    tokenNumberData.CaseNum = queryDict["CaseNum"];
                    tokenNumberData.PatientType = queryDict["PatientType"];
                    tokenNumberData.TokenNumber = queryDict["TokenNumber"];
                    tokenNumberData.TokenDate = queryDict["TokenDate"];
                    tokenNumberData.TokenTime = queryDict["TokenTime"];

                    //Console.WriteLine("Token Number printing values.\n\tCase Number : " + CaseNum + "\n\tPatient Type : " + PatientType + "\n\tToken Number : " + TokenNumber + "\n\tToken Date : " + TokenDate + "\n\tToken Time : " + TokenTime);
                    mgr.PrintHandler(host, tokenNumberData);
                }
                else if(host == "printpaymentreceipt")
                {
                    string PaymentHashID = queryDict["PaymentHashID"];
                    string AmountPaid = queryDict["AmountPaid"];
                    string PaymentDate = queryDict["PaymentDate"];
                    
                    dynamic paymentReceiptData = new System.Dynamic.ExpandoObject();
                    paymentReceiptData.PaymentHashID = queryDict["PaymentHashID"];
                    paymentReceiptData.AmountPaid = queryDict["AmountPaid"];
                    paymentReceiptData.PaymentDate = queryDict["PaymentDate"];

                    //Console.WriteLine("Payment Receipt printing values.\n\tPayment Hash ID : " + PaymentHashID + "\n\tAmount Paid : " + AmountPaid + "\n\tPayment Date : " + PaymentDate);
                    mgr.PrintHandler(host, paymentReceiptData);
                }
                else if(host == "generatepatienttoken")
                {
                    // feature not developed yet
                }
            }
        }
    }
    class PrinterManager
    {
        private string printerName;
        private dynamic printData;
        public PrinterManager()
        {
            printerName = ConfigurationManager.AppSettings["PrinterName"];
        }
        public void PrintHandler(string host, dynamic printData)
        {
            this.printData = printData;
            PrinterSettings settings = new PrinterSettings();
            settings.PrinterName = printerName;

            PrintDocument printDoc = new PrintDocument();
            printDoc.PrinterSettings = settings;
            if(host == "printtokennumber")
            {
                printDoc.PrintPage += PrintTokenNumber_PrintPage;
            }
            else if(host == "printpaymentreceipt")
            {
                printDoc.PrintPage += PrintPaymentReceipt_PrintPage;
            }
            else if(host == "generatepatienttoken")
            {
                // feature not developed yet
            }
            printDoc.Print();
        }
        private void PrintTokenNumber_PrintPage(object sender, PrintPageEventArgs e)
        {
            int TopMargin = 8;
            int LeftMargin = 20;
            int RightMargin = 263;
            int MarginWidth = RightMargin - LeftMargin;

            int y = TopMargin;

            String imgPath = ConfigurationManager.AppSettings["LogoImagePath"];
            Image image = Image.FromFile(imgPath);
            float imageRatio = (float)(RightMargin - 30) / image.Width;
            int newImageWidth = (int)(image.Width * imageRatio);
            int newImageHeight = (int)(image.Height * imageRatio);
            Image newImage = new Bitmap(newImageWidth, newImageHeight);
            using (Graphics g = Graphics.FromImage(newImage))
            {
                g.DrawImage(image, 0, 0, newImageWidth, newImageHeight);
            }
            float x = LeftMargin + ((RightMargin - LeftMargin) - newImage.Width) / 2;
            e.Graphics.DrawImage(newImage, x, y);
            y += newImageHeight + 10;

            Pen blackPen = new Pen(Color.Black, 2);
            e.Graphics.DrawLine(blackPen, LeftMargin, y, RightMargin, y);
            y += 10;

            var font = new Font("Arial", 14);
            string emptySpaces = "";
            int limit = MarginWidth - 5;
            while (limit - e.Graphics.MeasureString((printData.TokenDate + emptySpaces + printData.TokenTime), font).Width > 0)
            {
                emptySpaces += " ";
            }
            string dateTimeString = printData.TokenDate + emptySpaces + printData.TokenTime;
            x = LeftMargin + (MarginWidth - e.Graphics.MeasureString(dateTimeString, font).Width) / 2;
            e.Graphics.DrawString(dateTimeString, font, Brushes.Black, new RectangleF(x, y, MarginWidth, 30));
            y += 30;

            if(printData.CaseNum != "null")
            {
                font = new Font("Arial", 11);
                string CaseNum = "Case No: " + printData.CaseNum;
                x = LeftMargin;
                e.Graphics.DrawString(CaseNum, font, Brushes.Black, x, y);
                y += 25;
            }

            blackPen = new Pen(Color.Black, 2);
            e.Graphics.DrawLine(blackPen, LeftMargin, y, RightMargin, y);
            y += 10;

            string TokenTypeString = printData.PatientType.ToUpper() + " TOKEN NUMBER";
            font = new Font("Arial", 13);
            x = LeftMargin + (MarginWidth - e.Graphics.MeasureString(TokenTypeString, font).Width) / 2;
            e.Graphics.DrawString(TokenTypeString, font, Brushes.Black, new RectangleF(x, y, MarginWidth, 30));
            y += 30;

            blackPen = new Pen(Color.Black, 2);
            e.Graphics.DrawLine(blackPen, LeftMargin, y, RightMargin, y);
            y += 40;

            font = new Font("Arial", 20);
            x = LeftMargin + (MarginWidth - e.Graphics.MeasureString(printData.TokenNumber, font).Width) / 2;
            e.Graphics.DrawString(printData.TokenNumber, font, Brushes.Black, new RectangleF(x, y, MarginWidth, 30));
            y += 70;

            blackPen = new Pen(Color.Black, 2);
            e.Graphics.DrawLine(blackPen, LeftMargin, y, RightMargin, y);
            y += 10;

            string SoftwareDevFooter = "Software developed by: Khizir Farrukh Chawla";
            string SoftwareDevEmail = "Email: khizirfarrukh@outlook.com";
            font = new Font("Arial", 8);
            x = LeftMargin + (MarginWidth - e.Graphics.MeasureString(SoftwareDevFooter, font).Width) / 2;
            e.Graphics.DrawString(SoftwareDevFooter, font, Brushes.Black, new RectangleF(x, y, MarginWidth, 15));
            y += 15;
            x = LeftMargin + (MarginWidth - e.Graphics.MeasureString(SoftwareDevEmail, font).Width) / 2;
            e.Graphics.DrawString(SoftwareDevEmail, font, Brushes.Black, new RectangleF(x, y, MarginWidth, 15));
        }
        private void PrintPaymentReceipt_PrintPage(object sender, PrintPageEventArgs e)
        {
            int TopMargin = 8;
            int LeftMargin = 20;
            int RightMargin = 263;
            int MarginWidth = RightMargin - LeftMargin;
            float x;
            int y = TopMargin;
            Pen blackPen;

            String imgPath = ConfigurationManager.AppSettings["LogoImagePath"];
            Image image = Image.FromFile(imgPath);
            float logoImageRatio = (float)(RightMargin - 30) / image.Width;
            int newLogoImageWidth = (int)(image.Width * logoImageRatio);
            int newLogoImageHeight = (int)(image.Height * logoImageRatio);
            Image newImage = new Bitmap(newLogoImageWidth, newLogoImageHeight);
            using (Graphics g = Graphics.FromImage(newImage))
            {
                g.DrawImage(image, 0, 0, newLogoImageWidth, newLogoImageHeight);
            }
            x = LeftMargin + ((RightMargin - LeftMargin) - newImage.Width) / 2;
            e.Graphics.DrawImage(newImage, x, y);
            y += newLogoImageHeight + 10;

            var font = new Font("Arial", 8, FontStyle.Underline);
            string initialInvoiceText = "Initial Payment Invoice";
            x = LeftMargin + (MarginWidth - e.Graphics.MeasureString(initialInvoiceText, font).Width) / 2;
            e.Graphics.DrawString(initialInvoiceText, font, Brushes.Black, new RectangleF(x, y, MarginWidth, 15));
            y += 18;

            font = new Font("Arial", 11);
            x = LeftMargin;

            string PaymentHashID = "Payment ID: " + printData.PaymentHashID;
            e.Graphics.DrawString(PaymentHashID, font, Brushes.Black, x, y);
            y += 20;

            string AmountPaid = "Amount Paid: " + printData.AmountPaid;
            e.Graphics.DrawString(AmountPaid, font, Brushes.Black, x, y);
            y += 20;

            string PaymentDate = "Date: " + printData.PaymentDate;
            e.Graphics.DrawString(PaymentDate, font, Brushes.Black, new RectangleF(x, y, MarginWidth, 30));
            y += 20;

            if(ConfigurationManager.AppSettings["PrintQRCode"] == "true")
            {
                blackPen = new Pen(Color.Black, 2);
                e.Graphics.DrawLine(blackPen, LeftMargin, y, RightMargin, y);
                y += 10;

                string textToEncode = printData.PaymentHashID;
                QRCodeGenerator qrGenerator = new QRCodeGenerator();
                QRCodeData qrCodeData = qrGenerator.CreateQrCode(textToEncode, QRCodeGenerator.ECCLevel.Q);
                QRCode qrCode = new QRCode(qrCodeData);
                Bitmap qrCodeImage = qrCode.GetGraphic(20);

                float QRImageRatio = (float)(RightMargin - 90) / qrCodeImage.Width;
                int newQRImageWidth = (int)(qrCodeImage.Width * QRImageRatio);
                int newQRImageHeight = (int)(qrCodeImage.Height * QRImageRatio);
                newImage = new Bitmap(newQRImageWidth, newQRImageHeight);
                using (Graphics g = Graphics.FromImage(newImage))
                {
                    g.DrawImage(qrCodeImage, 0, 0, newQRImageWidth, newQRImageHeight);
                }
                x = LeftMargin + ((RightMargin - LeftMargin) - newImage.Width) / 2;
                e.Graphics.DrawImage(newImage, x, y);
                y += newQRImageHeight + 10;
            }

            blackPen = new Pen(Color.Black, 2);
            e.Graphics.DrawLine(blackPen, LeftMargin, y, RightMargin, y);
            y += 10;

            string SoftwareDevFooter = "Software developed by: Khizir Farrukh Chawla";
            string SoftwareDevEmail = "Email: khizirfarrukh@outlook.com";
            font = new Font("Arial", 8);
            x = LeftMargin + (MarginWidth - e.Graphics.MeasureString(SoftwareDevFooter, font).Width) / 2;
            e.Graphics.DrawString(SoftwareDevFooter, font, Brushes.Black, new RectangleF(x, y, MarginWidth, 15));
            y += 15;
            x = LeftMargin + (MarginWidth - e.Graphics.MeasureString(SoftwareDevEmail, font).Width) / 2;
            e.Graphics.DrawString(SoftwareDevEmail, font, Brushes.Black, new RectangleF(x, y, MarginWidth, 15));
        }
    }
}
