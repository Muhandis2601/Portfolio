import customtkinter
import math
from back import cal



customtkinter.set_appearance_mode('dark')


def calculate_capacitor_correction(voltage, current, pfAwal, pfAkhir, frequency):
    # Rumus Power Factor Correction
    QAwal = voltage * current * math.sin(math.acos(pfAwal))
    QAkhir = voltage * current * math.sin(math.acos(pfAkhir))
    delta_Q = QAwal - QAkhir
    Q = delta_Q / (2 * math.pi * frequency * voltage**2)
    Q_microfarad = Q * 10**6
    return Q_microfarad

def hitung_kapasitor():
    voltage = float(volt_entry.get())
    current = float(current_entry.get())
    pfAwal = float(in_cosphi_entry.get())
    pfAkhir = float(des_cosphi_entry.get())
    frequency = float(freq_entry.get())

    kapasitor_perbaikan = calculate_capacitor_correction(voltage, current, pfAwal, pfAkhir, frequency)
    Hasil = hasil.configure(text=f"Kapasitor perbaikan yang dibutuhkan: {round(kapasitor_perbaikan, 2)} μF")

def hwd():
    def fwd():
        hhh()
        main_menu.destroy()
    main_menu = customtkinter.CTkFrame(master=power_factor,fg_color='#003B46')
    main_menu.place(x=0,y=0)
    wd= customtkinter.CTkButton(main_menu,command=fwd)
    wd.place(x=2,y=2)
def hhh():
    def hih():
        mmm.destroy()
    mmm = customtkinter.CTkFrame(master=power_factor,fg_color='blue')
    mmm.place(x=10,y=10)
    wd= customtkinter.CTkButton(mmm,command=hih)
    wd.place(x=2,y=2)


power_factor = customtkinter.CTk()
power_factor.geometry('600x300')
power_factor.title('Power Factor Correction - Kelompok 2')

#Judul
title=customtkinter.CTkLabel(power_factor,text='Power Factor Correction',text_color='#66A4AC',font=('Bernard MT Condensed',25),justify='center',width=20,height=25)
title.place(x=2,y=2)

#Fitur
volt = customtkinter.CTkLabel(power_factor,text='Voltage (V) :',text_color='#66A4AC',font=('BankGothic Lt BT',20))
volt.place(x=2,y=50)
volt_entry = customtkinter.CTkEntry(power_factor,fg_color='#C3DEE5',text_color='black',width=180)
volt_entry.place(x=2,y=80)
current = customtkinter.CTkLabel(power_factor,text='Current (A) :',text_color='#66A4AC',font=('BankGothic Lt BT',20))
current.place(x=2,y=110)
current_entry = customtkinter.CTkEntry(power_factor,fg_color='#C3DEE5',text_color='black',width=180)
current_entry.place(x=2,y=140)
freq = customtkinter.CTkLabel(power_factor,text='Frequency (Hz) :',text_color='#66A4AC',font=('BankGothic Lt BT',20))
freq.place(x=2,y=170)
freq_entry = customtkinter.CTkEntry(power_factor,fg_color='#C3DEE5',text_color='black',width=180)
freq_entry.place(x=2,y=200)
des_cosphi = customtkinter.CTkLabel(power_factor,text='Desired Cosphi :',text_color='#66A4AC',font=('BankGothic Lt BT',20))
des_cosphi.place(x=220,y=50)
des_cosphi_entry = customtkinter.CTkEntry(power_factor,fg_color='#C3DEE5',text_color='black',width=180)
des_cosphi_entry.place(x=220,y=80)
in_cosphi = customtkinter.CTkLabel(power_factor,text='Initial Cosphi :',text_color='#66A4AC',font=('BankGothic Lt BT',20))
in_cosphi.place(x=220,y=110)
in_cosphi_entry = customtkinter.CTkEntry(power_factor,fg_color='#C3DEE5',text_color='black',width=180)
in_cosphi_entry.place(x=220,y=140)

#Tombol
calc =customtkinter.CTkButton(power_factor,text='Calculate',text_color='#66A4AC',font=('Arial Rounded MT Bold',20),fg_color='#07575B',command=hitung_kapasitor)
calc.place(x=240,y=200)

wd1= customtkinter.CTkButton(power_factor,command=hwd)
wd1.place(x=260,y=260)

#Hasil
hasil = customtkinter.CTkLabel(power_factor,text='',text_color='#66A4AC',font=('BankGothic Lt BT',15))
hasil.place(x=50,y=250)




power_factor.mainloop()