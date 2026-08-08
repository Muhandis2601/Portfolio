import customtkinter as ctk
from tkinter import messagebox
from BackEnd import calculate_capacitor_correction_1fase
from BackEnd import calculate_capacitor_correction_3fase

ctk.set_appearance_mode('dark')
main= ctk.CTk(fg_color='#003B46')
main.geometry('450x300')
title = main.title('Power Factor Correction - Kelompok 2')

def screen_op():
    def inst1():
        screen_1ph()
        option.destroy()
    def inst3():
        screen_3ph()
        option.destroy()
    def main1():
        option.destroy()
    option = ctk.CTkFrame(master=main,fg_color='#003B46',width=450,height=300)
    option.place(x=0,y=0)

    #Judul
    title=ctk.CTkLabel(option,text='Power Factor Correction',text_color='#66A4AC',font=('Bernard MT Condensed',25),justify='center',width=20,height=25)
    title.place(x=2,y=2)

    #Label & Entry
    question = ctk.CTkLabel(option,text='Choose Your Instalation',text_color='#66A4AC',font=('Bernard MT Condensed',25),justify='center',width=20,height=25)
    question.place(x=110,y=70)

    #Tombol
    inst_1ph = ctk.CTkButton(option,text='1 Phase',font=('Arial Rounded MT Bold',30),text_color='#66A4AC',fg_color='#07575B',width=230,height=50,command=inst1)
    inst_1ph.place(x=110,y=110)
    inst_3ph = ctk.CTkButton(option,text='3 Phase',font=('Arial Rounded MT Bold',30),text_color='#66A4AC',fg_color='#07575B',width=230,height=50,command=inst3)
    inst_3ph.place(x=110,y=170)
    mainmenu= ctk.CTkButton(option,text='Main Menu',font=('Arial Rounded MT Bold',15),text_color='#66A4AC',fg_color='#07575B',width=20,command=main1)
    mainmenu.place(x=350,y=5)

def screen_1ph():
    def inst3():
        screen_3ph()
        inst_1ph.destroy()
    def main2():
        inst_1ph.destroy()
    def hitung_kapasitor():
        try:
            voltage = float(volt_entry.get())
            current = float(current_entry.get())
            pfAwal = float(in_cosphi_entry.get())
            pfAkhir = float(des_cosphi_entry.get())
            frequency = float(freq_entry.get())
            if pfAkhir <= 1 :
                kapasitor_perbaikan = calculate_capacitor_correction_1fase(voltage, current, pfAwal, pfAkhir, frequency)
                hasil.configure(text=f"Kapasitor perbaikan yang dibutuhkan\ndari tegangan 1 fase adalah: {round(kapasitor_perbaikan, 2)} μF")
            else:
                messagebox.showerror('error', "Cospi yang di inginkan lebih dari 1")
        except:
            messagebox.showerror('error', "ada kesalahan pada input")
    def reset():
        inst_1ph.destroy()
        screen_1ph()

    inst_1ph = ctk.CTkFrame(master=main,fg_color='#003B46',width=450,height=300)
    inst_1ph.place(x=0,y=0)
    #Judul
    title=ctk.CTkLabel(inst_1ph,text='Power Factor Correction',text_color='#66A4AC',font=('Bernard MT Condensed',25),justify='center',width=20,height=25)
    title.place(x=100,y=2)

    #Label & Entry
    volt = ctk.CTkLabel(inst_1ph,text='Voltage (V) :',text_color='#66A4AC',font=('BankGothic Lt BT',20))
    volt.place(x=30,y=50)
    volt_entry = ctk.CTkEntry(inst_1ph,fg_color='#C3DEE5',text_color='black',width=180)
    volt_entry.place(x=30,y=80)

    current = ctk.CTkLabel(inst_1ph,text='Current (A) :',text_color='#66A4AC',font=('BankGothic Lt BT',20))
    current.place(x=30,y=110)
    current_entry = ctk.CTkEntry(inst_1ph,fg_color='#C3DEE5',text_color='black',width=180)
    current_entry.place(x=30,y=140)

    freq = ctk.CTkLabel(inst_1ph,text='Frequency (Hz) :',text_color='#66A4AC',font=('BankGothic Lt BT',20))
    freq.place(x=30,y=170)
    freq_entry = ctk.CTkEntry(inst_1ph,fg_color='#C3DEE5',text_color='black',width=180)
    freq_entry.place(x=30,y=200)

    des_cosphi = ctk.CTkLabel(inst_1ph,text='Desired Cosphi :',text_color='#66A4AC',font=('BankGothic Lt BT',20))
    des_cosphi.place(x=230,y=50)
    des_cosphi_entry = ctk.CTkEntry(inst_1ph,fg_color='#C3DEE5',text_color='black',width=180)
    des_cosphi_entry.place(x=230,y=80)

    in_cosphi = ctk.CTkLabel(inst_1ph,text='Initial Cosphi :',text_color='#66A4AC',font=('BankGothic Lt BT',20))
    in_cosphi.place(x=230,y=110)
    in_cosphi_entry = ctk.CTkEntry(inst_1ph,fg_color='#C3DEE5',text_color='black',width=180)
    in_cosphi_entry.place(x=230,y=140)

    #Tombol
    calc =ctk.CTkButton(inst_1ph,text='Calculate',text_color='#66A4AC',font=('Arial Rounded MT Bold',15),fg_color='#07575B',width=10, command=hitung_kapasitor)
    calc.place(x=230,y=200)

    mainmenu= ctk.CTkButton(inst_1ph,text='Main Menu',font=('Arial Rounded MT Bold',15),text_color='#66A4AC',fg_color='#07575B',width=20,command=main2)
    mainmenu.place(x=350,y=5)

    swth_3ph = ctk.CTkButton(inst_1ph,text='3 Phase',font=('Arial Rounded MT Bold',15),text_color='#66A4AC',fg_color='#07575B',width=20,command=inst3)
    swth_3ph.place(x=10,y=5)

    rst= ctk.CTkButton(inst_1ph, text='Reset', font=('Arial Rounded MT Bold', 15), text_color='#66A4AC', fg_color='#07575B', width=20, command=reset)
    rst.place(x=350,y=200)

    
    #Hasil
    hasil = ctk.CTkLabel(inst_1ph,text='',text_color='#66A4AC',font=('BankGothic Lt BT',20))
    hasil.place(x=10,y=250)

def screen_3ph():
    def inst1():
        screen_1ph()
        inst_3ph.destroy()
    def back1():
        inst_3ph.destroy()
    def hitung_kapasitor():
        
        try:
            voltage = float(volt_entry.get())
            current = float(current_entry.get())
            pfAwal = float(in_cosphi_entry.get())
            pfAkhir = float(des_cosphi_entry.get())
            frequency = float(freq_entry.get())
            if pfAkhir <= 1 :
                pfAkhir = float(des_cosphi_entry.get())
                kapasitor_perbaikan = calculate_capacitor_correction_3fase(voltage, current, pfAwal, pfAkhir, frequency)
                hasil.configure(text=f"Kapasitor perbaikan yang dibutuhkan\ndari tegangan 3 fase adalah: {round(kapasitor_perbaikan, 2)} μF")
            else  :
                messagebox.showerror('error', "Nilai Cospi Yang di Inginkan lebih besar dari 1")
                
        except:
            messagebox.showerror('error', "ada kesalahan pada input")
    def reset():
        inst_3ph.destroy()
        screen_3ph()

    inst_3ph = ctk.CTkFrame(master=main,fg_color='#003B46',width=450,height=300)
    inst_3ph.place(x=0,y=0)
    #Judul
    title=ctk.CTkLabel(inst_3ph,text='Power Factor Correction',text_color='#66A4AC',font=('Bernard MT Condensed',25),justify='center',width=20,height=25)
    title.place(x=100,y=2)

    #Label & Entry
    volt = ctk.CTkLabel(inst_3ph,text='Voltage LL (V) :',text_color='#66A4AC',font=('BankGothic Lt BT',20))
    volt.place(x=30,y=50)
    volt_entry = ctk.CTkEntry(inst_3ph,fg_color='#C3DEE5',text_color='black',width=180)
    volt_entry.place(x=30,y=80)
    current = ctk.CTkLabel(inst_3ph,text='Current (A) :',text_color='#66A4AC',font=('BankGothic Lt BT',20))
    current.place(x=30,y=110)
    current_entry = ctk.CTkEntry(inst_3ph,fg_color='#C3DEE5',text_color='black',width=180)
    current_entry.place(x=30,y=140)
    freq = ctk.CTkLabel(inst_3ph,text='Frequency (Hz) :',text_color='#66A4AC',font=('BankGothic Lt BT',20))
    freq.place(x=30,y=170)
    freq_entry = ctk.CTkEntry(inst_3ph,fg_color='#C3DEE5',text_color='black',width=180)
    freq_entry.place(x=30,y=200)
    des_cosphi = ctk.CTkLabel(inst_3ph,text='Desired Cosphi :',text_color='#66A4AC',font=('BankGothic Lt BT',20))
    des_cosphi.place(x=230,y=50)
    des_cosphi_entry = ctk.CTkEntry(inst_3ph,fg_color='#C3DEE5',text_color='black',width=180)
    des_cosphi_entry.place(x=230,y=80)
    in_cosphi = ctk.CTkLabel(inst_3ph,text='Initial Cosphi :',text_color='#66A4AC',font=('BankGothic Lt BT',20))
    in_cosphi.place(x=230,y=110)
    in_cosphi_entry = ctk.CTkEntry(inst_3ph,fg_color='#C3DEE5',text_color='black',width=180)
    in_cosphi_entry.place(x=230,y=140)

    #Tombol
    calc =ctk.CTkButton(inst_3ph,text='Calculate',text_color='#66A4AC',font=('Arial Rounded MT Bold',15),fg_color='#07575B',width=10, command=hitung_kapasitor)
    calc.place(x=230,y=200)

    mainmenu= ctk.CTkButton(inst_3ph,text='Main Menu',font=('Arial Rounded MT Bold',15),text_color='#66A4AC',fg_color='#07575B',width=20,command=back1)
    mainmenu.place(x=350,y=5)

    swth_1ph = ctk.CTkButton(inst_3ph,text='1 Phase',font=('Arial Rounded MT Bold',15),text_color='#66A4AC',fg_color='#07575B',width=20,command=inst1)
    swth_1ph.place(x=10,y=5)

    rst= ctk.CTkButton(inst_3ph, text='Reset', font=('Arial Rounded MT Bold', 15), text_color='#66A4AC', fg_color='#07575B', width=20, command=reset)
    rst.place(x=350,y=200)

    #Hasil
    hasil = ctk.CTkLabel(inst_3ph,text='',text_color='#66A4AC',font=('BankGothic Lt BT',20))
    hasil.place(x=10,y=250)

def show_info():
    helpframe = ctk.CTkFrame(master=main,fg_color='#003B46',width=450,height=300)
    helpframe.place(x=0,y=0)
    scrollable_frame = ctk.CTkScrollableFrame(helpframe, width=430, height=300)
    scrollable_frame.place(x=0,y=20)
    hasil = ctk.CTkLabel(scrollable_frame,text="Program ini menghitung koreksi kapasitor yang diperlukan untuk koreksi faktor daya",text_color='#66A4AC',font=('BankGothic Lt BT',20))
    hasil.place(x=50,y=50)
    #messagebox.showinfo("Information", info)

#title
title1=ctk.CTkLabel(main, text='Power Factor',text_color='#66A4AC',font=('Bernard MT Condensed',30),justify='center',width=20,height=25)
title1.place(x=145,y=10)
title2=ctk.CTkLabel(main,text='Correction',text_color='#66A4AC',font=('Bernard MT Condensed',30),justify='center',width=20,height=25)
title2.place(x=160,y=50)

#button
strt=ctk.CTkButton(main,text="START",font=('Clarendon BT',20),fg_color='#07575B',border_color='#07575B',text_color='#66A4AC',command=screen_op)
strt.place(x=150,y=120)
help=ctk.CTkButton(main,text='?',font=('Clarendon BT',20),fg_color='#07575B',border_color='#07575B',text_color='#66A4AC',width=25,height=25, command=show_info)
help.place(x=10,y=260)

#By
by1=ctk.CTkLabel(main,text='Produced By :',font=('Arial',10),fg_color='white')
by1.place(x=185,y=150)
by2=ctk.CTkLabel(main,text='Arief Indra Kusuma (21635)',font=('Arial',10),fg_color='white')
by2.place(x=150,y=170)
by3=ctk.CTkLabel(main,text='Estu Bekti Cahyana (20706)',font=('Arial',10),fg_color='white')
by3.place(x=150,y=190)
by4=ctk.CTkLabel(main,text='Muhandis Lawdzai Putra Sanjaya (20992)',font=('Arial',10),fg_color='white')
by4.place(x=125,y=210)

main.mainloop()