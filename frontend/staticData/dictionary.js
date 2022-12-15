const languageMap = {
    0: 'English',
    1: 'Shqip'
 }
 
 const dictionary = {
    'ballina': 'Home',
    'rreth nesh': 'About',
    'kurset': 'Courses',
    'kontakti': 'Contact',
    'kurset aktive': 'Active Courses',
    'krijo admin': 'Create Admin',
    'krijo kategori': 'Create Category',
    'krijo kurs': 'Create Course',
    'krijo profesor': 'Create Professor',
    'lista e adminëve': 'List of Admins',
    'lista e profesorëve': 'List of Professors',
    'lista e kurseve': 'List of Courses',
    'lista e studentëve': 'List of Students',
    'lista e kategorive': 'List of Categories',
    'ndrysho faqet': 'Edit Pages',
    'shto nivel': 'Add Level',
    'kurset më të shikuara': 'Popular Courses',
    'kurset në pritje': 'Pending Courses',
    'kurset e përfunduara': 'Finished courses',
    'krijo orar': 'Create time',
    'studentët': 'Students',
    'orari': 'Timetable',
    'oraret': 'Timetable',
    'ndrysho oraret': 'Edit Timetables',
    'krijo kuiz': 'Create Quiz',
    'ndrysho profilin': 'Edit Profile',
    'shto pyetje': 'Add answer',
    'rezultatet rankohen nga më i miri në fillim, tek në fund': 'The tiers are ranked from the first being the best to the last',
    'nivelet e përgjigjeve': 'Tiers',
    'imazhi është bashkangjitur': 'Image is attached',
    'vazhdo': 'Next',
    'dërgo të dhënat': 'Submit',
    'ju nuk keni kurse aktive': 'You have no active courses',
    'ju nuk keni kurse të përfunduara': 'You have no finished courses',
    'ju nuk keni kurse në pritje': 'You have no pending courses',
    'ndrysho faqet anglisht': 'Edit the English pages',
    'ruaj faqën': 'Save the page',
    'ballina': 'Home',
    'hapat': 'Steps',
    'ndrysho ballinën': 'Edit Home',
    'ndrysho kontakti': 'Edit Contact',
    'ndrysho rreth nesh': 'Edit About',
    'ndrysho kurset': 'Edit Courses',
    'pyetje të shpeshta': 'FAQ',
    'pyetje të shpeshta, përshkrimi': 'FAQ explanation',
    'history': 'Historia',
    'arsyet': 'Reasons',
    'forma': 'Form',
    'shiko të gjitha': 'View all',
    'hyni': 'Login',
    'regjistrohu': 'Register',
    'mëso më shumë': 'Read more',
    'kategoritë': 'Categories',
    'kontaktet': 'Contacts',
    'hyni si profesor': 'Log in as professor',
    'hyni si student': 'Log in as student',
    'klientët tanë': 'Our Clients',
    'pse ne': 'Why choose us',
    'lokacioni': 'Location',
    'kontakti': 'Contact',
    'telefoni': 'Phone',
    'dërgo': 'Send',
    'mbishkruaj': 'Update',
    'ju lutem zgjedhni nivelin për të parë profesorët': 'Please choose level to see the available professors',
    'nuk ka kuize për këtë kurs': 'No quiz for this course yet',
    'mund të vazhdoni me hapin tjetër': 'You can continue with the next step',
    'mbrapa': 'Back',
    'vazhdo': 'Next step',
    'përshkrimi i kursit': 'Course description',
    'kuizi': 'Quiz',
    'niveli': 'Level',
    'pagesa': 'Payment',
    'profesori': 'Professor',
    'ju keni': 'You got',
    'pyetje të rregullta nga': 'questions right out of',
    'pyetje': 'questions',
    'ne ju rekomandojmë nivelin': 'We recommend level',
    'për këtë kurs': 'for this course',
    'zgjedhni profesorin që të zgjedhni orarin': 'Choose professor in order to choose timetable',
    'duke u ngarkuar': 'Loading',
    'ky profesor nuk ka orë për këtë nivel': 'No schedules available for this professor in this level yet',
    'historia': 'History',
    'klientët': 'Clients',
    'nuk ka njoftime te reja': 'There are no new notifications',
    'vazhdoni tek pagesa': 'Go to payment',
    'të dhënat': 'Data',
    'të dhënat tuaja janë në rregull. ju mund të vazhdoni': 'Your data is correct. You can go ahead with the payment',
    'përfundo kuizin': 'Submit the quiz',
    'fshirja do të jetë e përhershme': 'Deleting is a permanent action',
    'po': 'Yes',
    'jo': 'No'
 }
 
 const idictionary = {
    'email': 'Email',
    'password': 'Fjalëkalimi',
    'first name': 'Emri',
    'last name': 'Mbiemri',
    'name': 'Emri',
    'name en': 'Emri Anglisht',
    'message': 'Mesazhi',
    'image': 'Foto',
    'category name': 'Emri Kategorisë',
    'category name english': 'Emri Kategorisë në Anglisht',
    'category description': 'Përshkrimi i kategorisë',
    'category description english': 'Përshkrimi i kategorisë në Anglisht',
    'category image': 'Foto e kategorisë',
    'course name': 'Emri Kursit',
    'course name english': 'Emri Kursit në Anglisht',
    'course image': 'Foto e Kursit',
    'course video url': 'Url i videos së kursit',
    'course description': 'Përshkrimi i Kursit',
    'course description english': 'Përshkrimi i Kursit në Anglisht',
    'course category': 'Kategoria e Kursit',
    'level name': 'Emri Nivelit',
    'level name english': 'Emri Nivelit në Anglisht',
    'level price': 'Cmimi i nivelit',
    'level description': 'Përshkrimi i Nivelit',
    'level description english': 'Përshkrimi i Nivelit në Anglisht',
    'course': 'Kursi',
    'question': 'Pyetja',
    'answer': 'Përgjigja',
    'level': 'Niveli',
    'monday': 'E hënë',
    'tuesday': 'E martë',
    'wednesday': 'E mërkurë',
    'wedensday': 'E mërkurë',
    'thursday': 'E enjte',
    'friday': 'E premte',
    'saturday': 'E shtunë',
    'sunday': 'E dielë',
    'has joined your class': 'është bërë pjesë e klasës tuaj',
    'phone number': 'Numri i telefonit',
    'professor image': 'Foto e profesorit',
    'header title': 'Titulli ballinës',
    'header subtitle': 'Nëntitulli i ballinës',
    'header button': 'Butoni i ballinës',
    'header button_url': 'Linku i butonit të ballinës',
    'title': 'Titulli',
    'body': 'Teksti',
    'button': 'Butoni',
    'button url': 'Linku i butonit',
    'handpicked courses': 'Kurset e përzgjedhura',
    'professor': 'Profesor',
    'student': 'Student',
    'category': 'Kategoria',
    'video': 'Video',
    'description': 'Përshkrimi',
    'description in english': 'Përshkrimi në anglisht',
 }
 
 export {
    languageMap,
    dictionary,
    idictionary
 };