(function() {
    'use strict';

    var DEFAULT_USER = 'admin';
    var DEFAULT_PASS = 'admin123';

    // ==========================================
    // UTILITY
    // ==========================================
    function showToast(msg, type) {
        type = type || 'success';
        var t = document.getElementById('toast');
        if (!t) return;
        var icons = { success:'<i class="fas fa-check-circle"></i>', error:'<i class="fas fa-exclamation-circle"></i>', info:'<i class="fas fa-info-circle"></i>' };
        t.className = 'toast ' + type;
        t.innerHTML = (icons[type]||'') + ' ' + msg;
        t.classList.add('show');
        setTimeout(function(){ t.classList.remove('show'); }, 3000);
    }

    function formatDate(d) {
        if (!d) return '-';
        var m = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
        var dt = new Date(d);
        if (isNaN(dt.getTime())) return d;
        return dt.getDate()+' '+m[dt.getMonth()]+' '+dt.getFullYear();
    }

    function getCurrentDate() { return formatDate(new Date().toISOString().split('T')[0]); }
    function padNumber(n, s) { var r=String(n); while(r.length<s)r='0'+r; return r; }

    function generateNomorSurat() {
        var id = JSON.parse(localStorage.getItem('identitasSekolah')||'{}');
        return '400.3.5 / '+padNumber(id.nomorSurat||1,3)+' / '+(id.kodeSurat||'XXX')+' / '+(id.tahunSurat||new Date().getFullYear());
    }

    function incrementNomorSurat() {
        var id = JSON.parse(localStorage.getItem('identitasSekolah')||'{}');
        id.nomorSurat = (parseInt(id.nomorSurat)||1)+1;
        localStorage.setItem('identitasSekolah', JSON.stringify(id));
    }

    function getGuruData() { return JSON.parse(localStorage.getItem('dataGuru')||'[]'); }
    function saveGuruData(d) { localStorage.setItem('dataGuru', JSON.stringify(d)); }
    function getSiswaData() { return JSON.parse(localStorage.getItem('dataSiswa')||'[]'); }
    function saveSiswaData(d) { localStorage.setItem('dataSiswa', JSON.stringify(d)); }
    function getCredentials() { return JSON.parse(localStorage.getItem('credentials')||'{}'); }

    function openModal(id) {
        document.getElementById('modalOverlay').classList.add('active');
        document.getElementById(id).classList.add('active');
    }

    function closeModal() {
        document.getElementById('modalOverlay').classList.remove('active');
        var ms = document.querySelectorAll('.modal');
        for (var i=0;i<ms.length;i++) ms[i].classList.remove('active');
    }

    function findColumn(row, aliases) {
        for (var a=0;a<aliases.length;a++) {
            var keys=Object.keys(row);
            for (var k=0;k<keys.length;k++) if(keys[k].toLowerCase().trim()===aliases[a]) return keys[k];
        }
        return null;
    }

    // ==========================================
    // LOGO REALTIME UPDATE - KEY FUNCTION
    // ==========================================
    function updateAllLogos() {
        var logoPemda = localStorage.getItem('logoDinas') || '';
        var logoSekolah = localStorage.getItem('logoSekolah') || '';
        var identitas = JSON.parse(localStorage.getItem('identitasSekolah')||'{}');
        var namaSekolah = identitas.namaSekolah || '';

        // --- LOGIN PAGE ---
        var loginLogoImg = document.getElementById('loginLogoImg');
        var loginDefaultIcon = document.getElementById('loginDefaultIcon');
        var loginSchoolName = document.getElementById('loginSchoolName');

        if (logoSekolah) {
            loginLogoImg.src = logoSekolah;
            loginLogoImg.style.display = 'block';
            loginDefaultIcon.style.display = 'none';
        } else {
            loginLogoImg.style.display = 'none';
            loginDefaultIcon.style.display = 'block';
        }
        if (loginSchoolName) loginSchoolName.textContent = namaSekolah || 'Sistem Surat Sekolah';

        // --- SIDEBAR ---
        var sidebarLogoImg = document.getElementById('sidebarLogoImg');
        var sidebarDefaultIcon = document.getElementById('sidebarDefaultIcon');
        var sidebarSchoolName = document.getElementById('sidebarSchoolName');

        if (logoSekolah) {
            sidebarLogoImg.src = logoSekolah;
            sidebarLogoImg.style.display = 'block';
            sidebarDefaultIcon.style.display = 'none';
        } else {
            sidebarLogoImg.style.display = 'none';
            sidebarDefaultIcon.style.display = 'block';
        }
        if (sidebarSchoolName) sidebarSchoolName.textContent = namaSekolah || 'Surat Sekolah';

        // --- TOPBAR ---
        var topPemda = document.getElementById('topbarPemdaLogo');
        var topSekolah = document.getElementById('topbarSekolahLogo');

        if (logoPemda) { topPemda.src = logoPemda; topPemda.style.display = 'block'; }
        else { topPemda.style.display = 'none'; }

        if (logoSekolah) { topSekolah.src = logoSekolah; topSekolah.style.display = 'block'; }
        else { topSekolah.style.display = 'none'; }

        // --- DASHBOARD WELCOME ---
        var dashPemda = document.getElementById('dashPemdaLogo');
        var dashPemdaDefault = document.getElementById('dashPemdaDefault');
        var dashSekolah = document.getElementById('dashSekolahLogo');
        var dashSekolahDefault = document.getElementById('dashSekolahDefault');
        var welcomeSchoolName = document.getElementById('welcomeSchoolName');

        if (logoPemda) {
            dashPemda.src = logoPemda; dashPemda.style.display = 'block';
            dashPemdaDefault.style.display = 'none';
        } else {
            dashPemda.style.display = 'none';
            dashPemdaDefault.style.display = 'block';
        }

        if (logoSekolah) {
            dashSekolah.src = logoSekolah; dashSekolah.style.display = 'block';
            dashSekolahDefault.style.display = 'none';
        } else {
            dashSekolah.style.display = 'none';
            dashSekolahDefault.style.display = 'block';
        }

        if (welcomeSchoolName) {
            welcomeSchoolName.textContent = namaSekolah
                ? 'Sistem Surat Menyurat ' + namaSekolah
                : 'Sistem Administrasi Surat Menyurat Sekolah';
        }

        // --- IDENTITAS PAGE PREVIEWS ---
        var previewDinas = document.getElementById('previewLogoDinas');
        var previewSekolah = document.getElementById('previewLogoSekolah');
        var btnHapusDinas = document.getElementById('btnHapusLogoDinas');
        var btnHapusSekolah = document.getElementById('btnHapusLogoSekolah');

        if (previewDinas) {
            if (logoPemda) {
                previewDinas.innerHTML = '<img src="'+logoPemda+'" alt="Logo Pemda">';
                if (btnHapusDinas) btnHapusDinas.style.display = 'flex';
            } else {
                previewDinas.innerHTML = '<i class="fas fa-cloud-upload-alt"></i><p>Klik untuk upload logo Pemda</p>';
                if (btnHapusDinas) btnHapusDinas.style.display = 'none';
            }
        }
        if (previewSekolah) {
            if (logoSekolah) {
                previewSekolah.innerHTML = '<img src="'+logoSekolah+'" alt="Logo Sekolah">';
                if (btnHapusSekolah) btnHapusSekolah.style.display = 'flex';
            } else {
                previewSekolah.innerHTML = '<i class="fas fa-cloud-upload-alt"></i><p>Klik untuk upload logo Sekolah</p>';
                if (btnHapusSekolah) btnHapusSekolah.style.display = 'none';
            }
        }
    }

    function previewLogo(inputId, storageKey) {
        var input = document.getElementById(inputId);
        if (!input||!input.files||!input.files[0]) return;
        var reader = new FileReader();
        reader.onload = function(e) {
            localStorage.setItem(storageKey, e.target.result);
            updateAllLogos();
            showToast('Logo berhasil diupload!', 'success');
        };
        reader.readAsDataURL(input.files[0]);
    }

    // ==========================================
    // AUTH
    // ==========================================
    function checkAuth() {
        if (sessionStorage.getItem('isLoggedIn')==='true') showApp();
        else showLogin();
    }

    function showLogin() {
        document.getElementById('loginPage').style.display = 'flex';
        document.getElementById('mainApp').style.display = 'none';
        updateAllLogos();
        var u = document.getElementById('loginUser');
        if (u) u.focus();
    }

    function showApp() {
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('mainApp').style.display = 'flex';
        var c = getCredentials();
        var username = c.username || DEFAULT_USER;
        var an = document.getElementById('adminName'); if(an) an.textContent = username;
        var wn = document.getElementById('welcomeName'); if(wn) wn.textContent = username;
        updateAllLogos();
        loadDashboard();
    }

    function doLogin(u, p) {
        var c = getCredentials();
        if (u===(c.username||DEFAULT_USER) && p===(c.password||DEFAULT_PASS)) {
            sessionStorage.setItem('isLoggedIn','true');
            document.getElementById('loginError').style.display = 'none';
            showToast('Login berhasil!','success');
            showApp();
        } else {
            document.getElementById('loginError').style.display = 'flex';
        }
    }

    function doLogout() {
        if (confirm('Yakin ingin keluar?')) {
            sessionStorage.removeItem('isLoggedIn');
            showLogin();
            showToast('Berhasil keluar.','info');
        }
    }

    // ==========================================
    // PAGE NAV
    // ==========================================
    function showPage(page) {
        var pages = document.querySelectorAll('.page');
        for(var i=0;i<pages.length;i++) pages[i].classList.remove('active');
        var t = document.getElementById('page-'+page);
        if(t) t.classList.add('active');

        var navs = document.querySelectorAll('.sidebar-nav li');
        for(var j=0;j<navs.length;j++) navs[j].classList.remove('active');
        var an = document.querySelector('.sidebar-nav li[data-page="'+page+'"]');
        if(an) an.classList.add('active');

        var titles = {
            'dashboard':'<i class="fas fa-tachometer-alt"></i> Dashboard',
            'identitas':'<i class="fas fa-building"></i> Identitas Sekolah',
            'data-guru':'<i class="fas fa-chalkboard-teacher"></i> Data Guru',
            'data-siswa':'<i class="fas fa-user-graduate"></i> Data Siswa',
            'surat-siswa':'<i class="fas fa-envelope-open-text"></i> Surat Siswa',
            'surat-guru':'<i class="fas fa-file-signature"></i> Surat Guru',
            'settings':'<i class="fas fa-cog"></i> Ubah Password'
        };
        var pt = document.getElementById('pageTitle');
        if(pt) pt.innerHTML = titles[page]||'';

        if(page==='dashboard') loadDashboard();
        if(page==='identitas') loadIdentitas();
        if(page==='data-guru') renderGuruTable();
        if(page==='data-siswa') renderSiswaTable();
        if(page==='surat-siswa') loadSuratSiswaPage();
        if(page==='surat-guru') loadSuratGuruPage();

        if(window.innerWidth<=768) document.getElementById('sidebar').classList.remove('mobile-open');
    }

    function toggleSidebar() {
        var sb = document.getElementById('sidebar');
        if(window.innerWidth<=768) sb.classList.toggle('mobile-open');
        else sb.classList.toggle('collapsed');
    }

    // ==========================================
    // DASHBOARD
    // ==========================================
    function loadDashboard() {
        var d = document.getElementById('currentDate'); if(d) d.textContent = getCurrentDate();
        var s=getSiswaData(), g=getGuruData();
        var ss=JSON.parse(localStorage.getItem('riwayatSuratSiswa')||'[]');
        var sg=JSON.parse(localStorage.getItem('riwayatSuratGuru')||'[]');
        var el;
        el=document.getElementById('totalSiswa'); if(el) el.textContent=s.length;
        el=document.getElementById('totalGuru'); if(el) el.textContent=g.length;
        el=document.getElementById('totalSuratSiswa'); if(el) el.textContent=ss.length;
        el=document.getElementById('totalSuratGuru'); if(el) el.textContent=sg.length;

        updateAllLogos();

        var all=[];
        for(var i=0;i<ss.length;i++) all.push({nomorSurat:ss[i].nomorSurat,jenis:ss[i].jenis,nama:ss[i].nama,tanggal:ss[i].tanggal,kat:'Siswa'});
        for(var j=0;j<sg.length;j++) all.push({nomorSurat:sg[j].nomorSurat,jenis:'Surat Tugas',nama:sg[j].nama,tanggal:sg[j].tanggal,kat:'Guru'});
        all.sort(function(a,b){return new Date(b.tanggal||0)-new Date(a.tanggal||0);});
        all=all.slice(0,10);

        var tb=document.getElementById('recentLettersBody'); if(!tb) return;
        if(!all.length){ tb.innerHTML='<tr><td colspan="5" class="empty-state">Belum ada surat</td></tr>'; return; }
        var h='';
        for(var k=0;k<all.length;k++){
            var lt=all[k], bg=lt.kat==='Siswa'?'rgba(79,70,229,0.1);color:#4f46e5':'rgba(16,185,129,0.1);color:#10b981';
            h+='<tr><td>'+(k+1)+'</td><td>'+(lt.nomorSurat||'-')+'</td><td><span style="background:'+bg+';padding:3px 10px;border-radius:20px;font-size:0.78rem;">'+(lt.jenis||'-')+'</span></td><td>'+(lt.nama||'-')+'</td><td>'+formatDate(lt.tanggal)+'</td></tr>';
        }
        tb.innerHTML=h;
    }

    // ==========================================
    // IDENTITAS
    // ==========================================
    function loadIdentitas() {
        var d=JSON.parse(localStorage.getItem('identitasSekolah')||'{}');
        var fields=['namaSekolah','npsn','alamatSekolah','kabupaten','namaKepsek','nipKepsek','nikKepsek','ttlKepsek','pangkatKepsek','kodeSurat'];
        for(var i=0;i<fields.length;i++){ var el=document.getElementById(fields[i]); if(el)el.value=d[fields[i]]||''; }
        var te=document.getElementById('tahunSurat'); if(te) te.value=d.tahunSurat||new Date().getFullYear();
        var ne=document.getElementById('nomorSurat'); if(ne) ne.value=d.nomorSurat||1;
        updateAllLogos();
        updatePreviewNomor();
    }

    function updatePreviewNomor() {
        var k=document.getElementById('kodeSurat'), t=document.getElementById('tahunSurat'), n=document.getElementById('nomorSurat'), p=document.getElementById('previewNomorSurat');
        if(!p)return;
        p.textContent='400.3.5 / '+padNumber(n?n.value||1:1,3)+' / '+(k?k.value||'XXX':'XXX')+' / '+(t?t.value||new Date().getFullYear():new Date().getFullYear());
    }

    function saveIdentitas() {
        var d={
            namaSekolah:document.getElementById('namaSekolah').value,
            npsn:document.getElementById('npsn').value,
            alamatSekolah:document.getElementById('alamatSekolah').value,
            kabupaten:document.getElementById('kabupaten').value,
            namaKepsek:document.getElementById('namaKepsek').value,
            nipKepsek:document.getElementById('nipKepsek').value,
            nikKepsek:document.getElementById('nikKepsek').value,
            ttlKepsek:document.getElementById('ttlKepsek').value,
            pangkatKepsek:document.getElementById('pangkatKepsek').value,
            kodeSurat:document.getElementById('kodeSurat').value,
            tahunSurat:document.getElementById('tahunSurat').value,
            nomorSurat:parseInt(document.getElementById('nomorSurat').value)||1
        };
        localStorage.setItem('identitasSekolah',JSON.stringify(d));
        updateAllLogos();
        showToast('Identitas sekolah berhasil disimpan!','success');
    }

    // ==========================================
    // DATA GURU
    // ==========================================
    function renderGuruTable(){
        var d=getGuruData(),se=document.getElementById('searchGuru'),s=se?se.value.toLowerCase():'';
        var f=[];
        for(var i=0;i<d.length;i++){var g=d[i];if((g.nama||'').toLowerCase().indexOf(s)!==-1||(g.nip||'').toLowerCase().indexOf(s)!==-1||(g.nuptk||'').toLowerCase().indexOf(s)!==-1)f.push({data:g,index:i});}
        var tb=document.getElementById('guruTableBody');if(!tb)return;
        if(!f.length){tb.innerHTML='<tr><td colspan="8" class="empty-state">Tidak ada data guru</td></tr>';return;}
        var h='';
        for(var j=0;j<f.length;j++){var it=f[j],g2=it.data;
            h+='<tr><td>'+(j+1)+'</td><td><strong>'+(g2.nama||'-')+'</strong></td><td>'+(g2.nip||'-')+'</td><td>'+(g2.nuptk||'-')+'</td><td>'+(g2.ttl||'-')+'</td><td><span style="background:rgba(16,185,129,0.1);color:#10b981;padding:2px 8px;border-radius:12px;font-size:0.78rem;">'+(g2.status||'-')+'</span></td><td>'+(g2.jabatan||'-')+'</td><td><div class="action-btns"><button class="btn-action btn-edit" data-edit-guru="'+it.index+'" title="Edit"><i class="fas fa-edit"></i></button><button class="btn-action btn-delete" data-delete-guru="'+it.index+'" title="Hapus"><i class="fas fa-trash"></i></button></div></td></tr>';
        }
        tb.innerHTML=h;
    }

    function showAddGuruModal(){document.getElementById('modalGuruTitle').innerHTML='<i class="fas fa-plus"></i> Tambah Data Guru';document.getElementById('formTambahGuru').reset();document.getElementById('guruEditIndex').value=-1;openModal('modalGuru');}

    function editGuru(i){var d=getGuruData(),g=d[i];if(!g)return;document.getElementById('modalGuruTitle').innerHTML='<i class="fas fa-edit"></i> Edit Data Guru';document.getElementById('guruNama').value=g.nama||'';document.getElementById('guruNip').value=g.nip||'';document.getElementById('guruNuptk').value=g.nuptk||'';document.getElementById('guruTtl').value=g.ttl||'';document.getElementById('guruStatus').value=g.status||'';document.getElementById('guruPangkat').value=g.pangkat||'';document.getElementById('guruJabatan').value=g.jabatan||'';document.getElementById('guruEditIndex').value=i;openModal('modalGuru');}

    function saveGuru(){
        var g={nama:document.getElementById('guruNama').value,nip:document.getElementById('guruNip').value,nuptk:document.getElementById('guruNuptk').value,ttl:document.getElementById('guruTtl').value,status:document.getElementById('guruStatus').value,pangkat:document.getElementById('guruPangkat').value,jabatan:document.getElementById('guruJabatan').value};
        if(!g.nama.trim()){showToast('Nama wajib diisi!','error');return;}
        var d=getGuruData(),ei=parseInt(document.getElementById('guruEditIndex').value);
        if(ei>=0){d[ei]=g;showToast('Data guru diperbarui!','success');}else{d.push(g);showToast('Data guru ditambahkan!','success');}
        saveGuruData(d);renderGuruTable();closeModal();
    }

    function hapusGuru(i){if(confirm('Hapus data guru ini?')){var d=getGuruData();d.splice(i,1);saveGuruData(d);renderGuruTable();showToast('Data guru dihapus!','info');}}
    function hapusSemuaGuru(){if(confirm('Hapus SEMUA data guru?')){saveGuruData([]);renderGuruTable();showToast('Semua data guru dihapus!','info');}}

    function importGuruExcel(ev){
        var f=ev.target.files[0];if(!f)return;
        var r=new FileReader();r.onload=function(e){try{var wb=XLSX.read(e.target.result,{type:'binary'}),sh=wb.Sheets[wb.SheetNames[0]],jd=XLSX.utils.sheet_to_json(sh,{defval:''});
        var d=getGuruData(),cm={nama:['nama','nama_lengkap','nama lengkap','nama_guru'],nip:['nip'],nuptk:['nuptk'],ttl:['ttl','tempat_tanggal_lahir','tempat tanggal lahir'],status:['status','status_pegawai','jenis_ptk'],pangkat:['pangkat','pangkat_golongan'],jabatan:['jabatan','jabatan_tugas']},imp=0;
        for(var i=0;i<jd.length;i++){var row=jd[i],g={},flds=Object.keys(cm);for(var fi=0;fi<flds.length;fi++){var col=findColumn(row,cm[flds[fi]]);g[flds[fi]]=col?String(row[col]).trim():'';}if(g.nama){d.push(g);imp++;}}
        saveGuruData(d);renderGuruTable();showToast(imp+' data guru diimpor!','success');}catch(err){showToast('Gagal membaca file!','error');}};r.readAsBinaryString(f);ev.target.value='';
    }

    function downloadTemplateGuru(){var h=[['Nama','NIP','NUPTK','Tempat Tanggal Lahir','Status Pegawai','Pangkat Golongan','Jabatan']],s=[['Mumun Munawaroh','198311302022212031','5462761663300003','Tangerang, 30-11-1983','PPPK','-','Guru']];var ws=XLSX.utils.aoa_to_sheet(h.concat(s));var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Template Guru');ws['!cols']=[{wch:25},{wch:22},{wch:20},{wch:25},{wch:15},{wch:18},{wch:15}];XLSX.writeFile(wb,'Template_Data_Guru.xlsx');showToast('Template diunduh!','info');}

    // ==========================================
    // DATA SISWA
    // ==========================================
    function renderSiswaTable(){
        var d=getSiswaData(),se=document.getElementById('searchSiswa'),s=se?se.value.toLowerCase():'';
        var f=[];for(var i=0;i<d.length;i++){var si=d[i];if((si.nama||'').toLowerCase().indexOf(s)!==-1||(si.nisn||'').toLowerCase().indexOf(s)!==-1||(si.nik||'').toLowerCase().indexOf(s)!==-1||(si.kelas||'').toLowerCase().indexOf(s)!==-1)f.push({data:si,index:i});}
        var tb=document.getElementById('siswaTableBody');if(!tb)return;
        if(!f.length){tb.innerHTML='<tr><td colspan="8" class="empty-state">Tidak ada data siswa</td></tr>';return;}
        var h='';for(var j=0;j<f.length;j++){var it=f[j],s2=it.data,jc=s2.jk==='L'?'rgba(79,70,229,0.1);color:#4f46e5':'rgba(236,72,153,0.1);color:#ec4899';
            h+='<tr><td>'+(j+1)+'</td><td><strong>'+(s2.nama||'-')+'</strong></td><td>'+(s2.nisn||'-')+'</td><td>'+(s2.nik||'-')+'</td><td>'+(s2.ttl||'-')+'</td><td><span style="background:'+jc+';padding:2px 8px;border-radius:12px;font-size:0.78rem;">'+(s2.jk||'-')+'</span></td><td>'+(s2.kelas||'-')+'</td><td><div class="action-btns"><button class="btn-action btn-edit" data-edit-siswa="'+it.index+'" title="Edit"><i class="fas fa-edit"></i></button><button class="btn-action btn-delete" data-delete-siswa="'+it.index+'" title="Hapus"><i class="fas fa-trash"></i></button></div></td></tr>';
        }tb.innerHTML=h;
    }

    function showAddSiswaModal(){document.getElementById('modalSiswaTitle').innerHTML='<i class="fas fa-plus"></i> Tambah Data Siswa';document.getElementById('formTambahSiswa').reset();document.getElementById('siswaEditIndex').value=-1;openModal('modalSiswa');}

    function editSiswa(i){var d=getSiswaData(),s=d[i];if(!s)return;document.getElementById('modalSiswaTitle').innerHTML='<i class="fas fa-edit"></i> Edit Data Siswa';document.getElementById('siswaNama').value=s.nama||'';document.getElementById('siswaNisn').value=s.nisn||'';document.getElementById('siswaNik').value=s.nik||'';document.getElementById('siswaTtl').value=s.ttl||'';document.getElementById('siswaJk').value=s.jk||'L';document.getElementById('siswaKelas').value=s.kelas||'';document.getElementById('siswaNamaAyah').value=s.namaAyah||'';document.getElementById('siswaPekerjaanAyah').value=s.pekerjaanAyah||'';document.getElementById('siswaAlamat').value=s.alamat||'';document.getElementById('siswaEditIndex').value=i;openModal('modalSiswa');}

    function saveSiswa(){
        var s={nama:document.getElementById('siswaNama').value,nisn:document.getElementById('siswaNisn').value,nik:document.getElementById('siswaNik').value,ttl:document.getElementById('siswaTtl').value,jk:document.getElementById('siswaJk').value,kelas:document.getElementById('siswaKelas').value,namaAyah:document.getElementById('siswaNamaAyah').value,pekerjaanAyah:document.getElementById('siswaPekerjaanAyah').value,alamat:document.getElementById('siswaAlamat').value};
        if(!s.nama.trim()){showToast('Nama wajib diisi!','error');return;}
        var d=getSiswaData(),ei=parseInt(document.getElementById('siswaEditIndex').value);
        if(ei>=0){d[ei]=s;showToast('Data siswa diperbarui!','success');}else{d.push(s);showToast('Data siswa ditambahkan!','success');}
        saveSiswaData(d);renderSiswaTable();closeModal();
    }

    function hapusSiswa(i){if(confirm('Hapus data siswa ini?')){var d=getSiswaData();d.splice(i,1);saveSiswaData(d);renderSiswaTable();showToast('Data siswa dihapus!','info');}}
    function hapusSemuaSiswa(){if(confirm('Hapus SEMUA data siswa?')){saveSiswaData([]);renderSiswaTable();showToast('Semua data siswa dihapus!','info');}}

    function importSiswaExcel(ev){
        var f=ev.target.files[0];if(!f)return;
        var r=new FileReader();r.onload=function(e){try{var wb=XLSX.read(e.target.result,{type:'binary'}),sh=wb.Sheets[wb.SheetNames[0]],jd=XLSX.utils.sheet_to_json(sh,{defval:''});
        var d=getSiswaData(),cm={nama:['nama','nama_lengkap','nama lengkap','nama_siswa','nama peserta didik'],nisn:['nisn'],nik:['nik'],ttl:['ttl','tempat_tanggal_lahir','tempat tanggal lahir'],jk:['jk','jenis_kelamin','jenis kelamin','l/p'],kelas:['kelas','rombel','kelas_rombel'],namaAyah:['nama_ayah','nama ayah'],pekerjaanAyah:['pekerjaan_ayah','pekerjaan ayah','pekerjaan'],alamat:['alamat','alamat_lengkap','alamat lengkap']},imp=0;
        for(var i=0;i<jd.length;i++){var row=jd[i],si={},flds=Object.keys(cm);for(var fi=0;fi<flds.length;fi++){var col=findColumn(row,cm[flds[fi]]);si[flds[fi]]=col?String(row[col]).trim():'';}if(si.jk){var jk=si.jk.toUpperCase();if(jk==='LAKI-LAKI'||jk==='L')si.jk='L';else if(jk==='PEREMPUAN'||jk==='P')si.jk='P';}if(si.nama){d.push(si);imp++;}}
        saveSiswaData(d);renderSiswaTable();showToast(imp+' data siswa diimpor!','success');}catch(err){showToast('Gagal membaca file!','error');}};r.readAsBinaryString(f);ev.target.value='';
    }

    function downloadTemplateSiswa(){var h=[['Nama','NISN','NIK','Tempat Tanggal Lahir','Jenis Kelamin','Kelas','Nama Ayah','Pekerjaan Ayah','Alamat']],s=[['ABID FADHIL UBAID','3163873913','3603132212160007','Tangerang, 22-12-2016','L','Kelas 3A','AJAT SUDRAJAT','Buruh','Jl. Raya Kampung Melayu']];var ws=XLSX.utils.aoa_to_sheet(h.concat(s));var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Template Siswa');ws['!cols']=[{wch:25},{wch:15},{wch:20},{wch:25},{wch:15},{wch:12},{wch:20},{wch:15},{wch:40}];XLSX.writeFile(wb,'Template_Data_Siswa.xlsx');showToast('Template diunduh!','info');}

    // ==========================================
    // SURAT SISWA
    // ==========================================
    function loadSuratSiswaPage(){
        document.getElementById('formSuratSiswa').style.display='none';
        var sd=getSiswaData(),sel=document.getElementById('selectSiswa');
        if(sel){sel.innerHTML='<option value="">-- Pilih Siswa atau Isi Manual --</option>';for(var i=0;i<sd.length;i++)sel.innerHTML+='<option value="'+i+'">'+sd[i].nama+' - '+(sd[i].kelas||'')+'</option>';}
        renderRiwayatSuratSiswa();
    }

    function buatSuratSiswa(jenis){
        document.getElementById('formSuratSiswa').style.display='block';
        document.getElementById('jenisSuratSiswa').value=jenis;
        var t={pindah:'<i class="fas fa-exchange-alt"></i> Surat Pindah Sekolah',aktif:'<i class="fas fa-check-circle"></i> Surat Keterangan Aktif',diterima:'<i class="fas fa-user-plus"></i> Surat Diterima'};
        document.getElementById('titleSuratSiswa').innerHTML=t[jenis]||'';
        document.getElementById('fieldsPindah').style.display=jenis==='pindah'?'block':'none';
        document.getElementById('fieldsDiterima').style.display=jenis==='diterima'?'block':'none';
        var id=JSON.parse(localStorage.getItem('identitasSekolah')||'{}');
        document.getElementById('suratTempatSiswa').value=id.kabupaten||'';
        document.getElementById('suratTanggalSiswa').value=new Date().toISOString().split('T')[0];
        document.getElementById('formSuratSiswa').scrollIntoView({behavior:'smooth'});
    }

    function fillSiswaData(){var i=document.getElementById('selectSiswa').value;if(i==='')return;var s=getSiswaData()[parseInt(i)];if(!s)return;document.getElementById('suratNamaSiswa').value=s.nama||'';document.getElementById('suratNisn').value=s.nisn||'';document.getElementById('suratNikSiswa').value=s.nik||'';document.getElementById('suratTtlSiswa').value=s.ttl||'';document.getElementById('suratJkSiswa').value=s.jk||'L';document.getElementById('suratKelasSiswa').value=s.kelas||'';document.getElementById('suratNamaAyah').value=s.namaAyah||'';document.getElementById('suratPekerjaanAyah').value=s.pekerjaanAyah||'';document.getElementById('suratAlamatSiswa').value=s.alamat||'';}

    function buildSuratHTML(type, data, identitas, nomorSurat) {
        var logoDinas=localStorage.getItem('logoDinas')||'';
        var logoSekolah=localStorage.getItem('logoSekolah')||'';
        var ns=identitas.namaSekolah||'[Nama Sekolah]';
        var ll=logoDinas?'<img src="'+logoDinas+'" class="logo" alt="Logo Pemda">':'<div style="width:70px;height:70px;"></div>';
        var lr=logoSekolah?'<img src="'+logoSekolah+'" class="logo" alt="Logo Sekolah">':'<div style="width:70px;height:70px;"></div>';

        var kop='<div class="surat-kop">'+ll+'<div class="kop-text"><div class="pemerintah">PEMERINTAH KABUPATEN '+(identitas.kabupaten||'TANGERANG').toUpperCase()+'</div><div class="dinas">DINAS PENDIDIKAN</div><div class="sekolah">'+ns.toUpperCase()+'</div><div class="alamat">'+(identitas.alamatSekolah||'Alamat Sekolah')+'</div></div>'+lr+'</div>';

        var ttd='<div style="clear:both;"></div><div class="surat-ttd"><p>Dikeluarkan di : '+(data.tempat||'-')+'</p><p>Pada Tanggal : '+formatDate(data.tanggal)+'</p><p>Kepala Sekolah,</p><div class="ttd-space"></div><p class="nama-kepsek">'+(identitas.namaKepsek||'[Nama Kepala Sekolah]')+'</p><p>NIP. '+(identitas.nipKepsek||'-')+'</p></div><div style="clear:both;"></div>';

        return {kop:kop, ttd:ttd, logoLeft:ll, logoRight:lr, namaSekolah:ns};
    }

    function previewSuratSiswa(){
        var jenis=document.getElementById('jenisSuratSiswa').value;
        var identitas=JSON.parse(localStorage.getItem('identitasSekolah')||'{}');
        var nomorSurat=generateNomorSurat();
        var d={nama:document.getElementById('suratNamaSiswa').value,nisn:document.getElementById('suratNisn').value,nik:document.getElementById('suratNikSiswa').value,ttl:document.getElementById('suratTtlSiswa').value,jk:document.getElementById('suratJkSiswa').value,kelas:document.getElementById('suratKelasSiswa').value,namaAyah:document.getElementById('suratNamaAyah').value,pekerjaanAyah:document.getElementById('suratPekerjaanAyah').value,alamat:document.getElementById('suratAlamatSiswa').value,alasanPindah:document.getElementById('suratAlasanPindah').value,sekolahTujuan:document.getElementById('suratSekolahTujuan').value,asalSekolah:document.getElementById('suratAsalSekolah').value,diterimaKelas:document.getElementById('suratDiterimaKelas').value,tempat:document.getElementById('suratTempatSiswa').value,tanggal:document.getElementById('suratTanggalSiswa').value,kertas:document.getElementById('kertasSuratSiswa').value};
        if(!d.nama){showToast('Nama siswa wajib diisi!','error');return;}

        var b=buildSuratHTML('siswa',d,identitas,nomorSurat);
        var tp=(identitas.tahunSurat||new Date().getFullYear())+'/'+(((parseInt(identitas.tahunSurat)||new Date().getFullYear()))+1);
        var dt='<table class="surat-data-table"><tr><td>Nama Lengkap</td><td>:</td><td>'+d.nama+'</td></tr><tr><td>NISN / NIK</td><td>:</td><td>'+(d.nisn||'-')+' / '+(d.nik||'-')+'</td></tr><tr><td>Tempat, Tgl Lahir</td><td>:</td><td>'+(d.ttl||'-')+'</td></tr><tr><td>Jenis Kelamin</td><td>:</td><td>'+d.jk+'</td></tr><tr><td>Kelas / Rombel</td><td>:</td><td>'+(d.kelas||'-')+'</td></tr><tr><td>Nama Ayah</td><td>:</td><td>'+(d.namaAyah||'-')+'</td></tr><tr><td>Pekerjaan</td><td>:</td><td>'+(d.pekerjaanAyah||'-')+'</td></tr><tr><td>Alamat Lengkap</td><td>:</td><td>'+(d.alamat||'-')+'</td></tr></table>';

        var judul='',isi='',jl='';
        if(jenis==='pindah'){judul='SURAT KETERANGAN PINDAH SEKOLAH';jl='Surat Pindah/Mutasi';isi='<p class="surat-isi">Yang bertanda tangan di bawah ini Kepala Sekolah '+b.namaSekolah+', menerangkan dengan sesungguhnya bahwa:</p>'+dt+'<p class="surat-isi">Berdasarkan surat permohonan pindah sekolah dari orang tua/wali siswa yang bersangkutan, maka menerangkan bahwa siswa tersebut mengajukan permohonan Pindah Sekolah / Mutasi Keluar dengan alasan '+(d.alasanPindah||'-')+'.</p><p class="surat-isi">Adapun sekolah yang menjadi tujuan mutasi adalah:</p><p class="surat-isi" style="text-align:center;font-weight:bold;margin:10px 0;">'+(d.sekolahTujuan||'[ Nama Sekolah Tujuan Belum Diisi ]')+'</p><p class="surat-isi">Bersama surat ini disertakan pula buku rapor asli yang bersangkutan. Demikian surat keterangan pindah sekolah ini dibuat untuk dapat dipergunakan sebagaimana mestinya.</p>';}
        else if(jenis==='aktif'){judul='SURAT KETERANGAN AKTIF SEKOLAH';jl='Surat Keterangan Aktif';isi='<p class="surat-isi">Yang bertanda tangan di bawah ini Kepala Sekolah '+b.namaSekolah+', menerangkan dengan sesungguhnya bahwa:</p>'+dt+'<p class="surat-isi">Adalah benar siswa tersebut di atas saat ini masih aktif dan terdaftar sebagai peserta didik di '+b.namaSekolah+' pada tahun pelajaran '+tp+'.</p><p class="surat-isi">Demikian surat keterangan ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.</p>';}
        else if(jenis==='diterima'){judul='SURAT KETERANGAN DITERIMA';jl='Surat Diterima';var dt2='<table class="surat-data-table"><tr><td>Nama Lengkap</td><td>:</td><td>'+d.nama+'</td></tr><tr><td>NISN / NIK</td><td>:</td><td>'+(d.nisn||'-')+' / '+(d.nik||'-')+'</td></tr><tr><td>Tempat, Tgl Lahir</td><td>:</td><td>'+(d.ttl||'-')+'</td></tr><tr><td>Jenis Kelamin</td><td>:</td><td>'+d.jk+'</td></tr><tr><td>Asal Sekolah</td><td>:</td><td>'+(d.asalSekolah||'-')+'</td></tr><tr><td>Nama Ayah</td><td>:</td><td>'+(d.namaAyah||'-')+'</td></tr><tr><td>Pekerjaan</td><td>:</td><td>'+(d.pekerjaanAyah||'-')+'</td></tr><tr><td>Alamat Lengkap</td><td>:</td><td>'+(d.alamat||'-')+'</td></tr></table>';isi='<p class="surat-isi">Yang bertanda tangan di bawah ini Kepala Sekolah '+b.namaSekolah+', menerangkan dengan sesungguhnya bahwa:</p>'+dt2+'<p class="surat-isi">Telah diterima dan terdaftar sebagai peserta didik di '+b.namaSekolah+' pada:</p><table class="surat-data-table"><tr><td>Kelas</td><td>:</td><td>'+(d.diterimaKelas||'-')+'</td></tr><tr><td>Tahun Pelajaran</td><td>:</td><td>'+tp+'</td></tr></table><p class="surat-isi">Demikian surat keterangan penerimaan ini dibuat untuk dapat dipergunakan sebagaimana mestinya.</p>';}

        var html=b.kop+'<div class="surat-judul">'+judul+'</div><div class="surat-nomor">Nomor: '+nomorSurat+'</div>'+isi+b.ttd;
        document.getElementById('suratPreviewContainer').innerHTML=html;
        window.currentSuratData={type:'siswa',jenis:jl,nomorSurat:nomorSurat,nama:d.nama,tanggal:d.tanggal,kertas:d.kertas,html:html,saved:false};
        openModal('modalPreviewSurat');
    }

    function saveSuratSiswaToHistory(){if(!window.currentSuratData||window.currentSuratData.type!=='siswa')return;var r=JSON.parse(localStorage.getItem('riwayatSuratSiswa')||'[]');r.push({nomorSurat:window.currentSuratData.nomorSurat,jenis:window.currentSuratData.jenis,nama:window.currentSuratData.nama,tanggal:window.currentSuratData.tanggal,html:window.currentSuratData.html,kertas:window.currentSuratData.kertas});localStorage.setItem('riwayatSuratSiswa',JSON.stringify(r));incrementNomorSurat();renderRiwayatSuratSiswa();}

    function renderRiwayatSuratSiswa(){
        var r=JSON.parse(localStorage.getItem('riwayatSuratSiswa')||'[]'),tb=document.getElementById('riwayatSuratSiswaBody');if(!tb)return;
        if(!r.length){tb.innerHTML='<tr><td colspan="6" class="empty-state">Belum ada riwayat</td></tr>';return;}
        var h='';for(var i=0;i<r.length;i++){var s=r[i];h+='<tr><td>'+(i+1)+'</td><td>'+(s.nomorSurat||'-')+'</td><td><span style="background:rgba(79,70,229,0.1);color:#4f46e5;padding:2px 8px;border-radius:12px;font-size:0.78rem;">'+(s.jenis||'-')+'</span></td><td>'+(s.nama||'-')+'</td><td>'+formatDate(s.tanggal)+'</td><td><div class="action-btns"><button class="btn-action btn-view" data-view-surat-siswa="'+i+'" title="Lihat"><i class="fas fa-eye"></i></button><button class="btn-action btn-delete" data-delete-surat-siswa="'+i+'" title="Hapus"><i class="fas fa-trash"></i></button></div></td></tr>';}
        tb.innerHTML=h;
    }

    // ==========================================
    // SURAT GURU
    // ==========================================
    function loadSuratGuruPage(){
        document.getElementById('formSuratGuru').style.display='none';
        var gd=getGuruData(),sel=document.getElementById('selectGuru');
        if(sel){sel.innerHTML='<option value="">-- Pilih Guru atau Isi Manual --</option>';for(var i=0;i<gd.length;i++)sel.innerHTML+='<option value="'+i+'">'+gd[i].nama+' - '+(gd[i].jabatan||'')+'</option>';}
        renderRiwayatSuratGuru();
    }

    function buatSuratGuru(){document.getElementById('formSuratGuru').style.display='block';var id=JSON.parse(localStorage.getItem('identitasSekolah')||'{}');document.getElementById('suratTempatGuru').value=id.kabupaten||'';document.getElementById('suratTanggalGuru').value=new Date().toISOString().split('T')[0];document.getElementById('formSuratGuru').scrollIntoView({behavior:'smooth'});}

    function fillGuruData(){var i=document.getElementById('selectGuru').value;if(i==='')return;var g=getGuruData()[parseInt(i)];if(!g)return;document.getElementById('suratNamaGuru').value=g.nama||'';document.getElementById('suratTtlGuru').value=g.ttl||'';document.getElementById('suratNipGuru').value=g.nip||'';document.getElementById('suratNuptkGuru').value=g.nuptk||'';document.getElementById('suratStatusGuru').value=g.status||'';document.getElementById('suratPangkatGuru').value=g.pangkat||'';document.getElementById('suratJabatanGuru').value=g.jabatan||'';}

    function previewSuratGuru(){
        var identitas=JSON.parse(localStorage.getItem('identitasSekolah')||'{}'),nomorSurat=generateNomorSurat();
        var d={nama:document.getElementById('suratNamaGuru').value,ttl:document.getElementById('suratTtlGuru').value,nip:document.getElementById('suratNipGuru').value,nuptk:document.getElementById('suratNuptkGuru').value,status:document.getElementById('suratStatusGuru').value,pangkat:document.getElementById('suratPangkatGuru').value,jabatan:document.getElementById('suratJabatanGuru').value,uraianTugas:document.getElementById('suratUraianTugas').value,tempat:document.getElementById('suratTempatGuru').value,tanggal:document.getElementById('suratTanggalGuru').value,kertas:document.getElementById('kertasSuratGuru').value};
        if(!d.nama){showToast('Nama guru wajib diisi!','error');return;}

        var b=buildSuratHTML('guru',d,identitas,nomorSurat);
        var html=b.kop+'<div class="surat-judul">SURAT TUGAS</div><div class="surat-nomor">Nomor: '+nomorSurat+'</div><p class="surat-isi">Yang bertanda tangan di bawah ini Kepala Sekolah '+b.namaSekolah+', dengan ini memberikan tugas kepada:</p><table class="surat-data-table"><tr><td>Nama Lengkap</td><td>:</td><td>'+d.nama+'</td></tr><tr><td>Tempat, Tgl Lahir</td><td>:</td><td>'+(d.ttl||'-')+'</td></tr><tr><td>NIP / NUPTK</td><td>:</td><td>'+(d.nip||'-')+' / '+(d.nuptk||'-')+'</td></tr><tr><td>Status Pegawai</td><td>:</td><td>'+(d.status||'-')+'</td></tr><tr><td>Pangkat / Golongan</td><td>:</td><td>'+(d.pangkat||'-')+'</td></tr><tr><td>Jabatan / Tugas</td><td>:</td><td>'+(d.jabatan||'-')+'</td></tr></table><p class="surat-isi">Untuk melaksanakan tugas:</p><p class="surat-isi" style="margin-left:30px;'+(d.uraianTugas?'':'font-style:italic;color:#888;')+'">'+(d.uraianTugas||'[Uraian Tugas Belum Diisi]')+'</p><p class="surat-isi">Demikian surat tugas ini diberikan agar dapat dilaksanakan dengan penuh tanggung jawab dan dilaporkan sebagaimana mestinya.</p>'+b.ttd;

        document.getElementById('suratPreviewContainer').innerHTML=html;
        window.currentSuratData={type:'guru',nomorSurat:nomorSurat,nama:d.nama,uraianTugas:d.uraianTugas,tanggal:d.tanggal,kertas:d.kertas,html:html,saved:false};
        openModal('modalPreviewSurat');
    }

    function saveSuratGuruToHistory(){if(!window.currentSuratData||window.currentSuratData.type!=='guru')return;var r=JSON.parse(localStorage.getItem('riwayatSuratGuru')||'[]');r.push({nomorSurat:window.currentSuratData.nomorSurat,nama:window.currentSuratData.nama,uraianTugas:window.currentSuratData.uraianTugas,tanggal:window.currentSuratData.tanggal,html:window.currentSuratData.html,kertas:window.currentSuratData.kertas});localStorage.setItem('riwayatSuratGuru',JSON.stringify(r));incrementNomorSurat();renderRiwayatSuratGuru();}

    function renderRiwayatSuratGuru(){
        var r=JSON.parse(localStorage.getItem('riwayatSuratGuru')||'[]'),tb=document.getElementById('riwayatSuratGuruBody');if(!tb)return;
        if(!r.length){tb.innerHTML='<tr><td colspan="6" class="empty-state">Belum ada riwayat</td></tr>';return;}
        var h='';for(var i=0;i<r.length;i++){var s=r[i],us=(s.uraianTugas||'-').substring(0,50)+((s.uraianTugas||'').length>50?'...':'');h+='<tr><td>'+(i+1)+'</td><td>'+(s.nomorSurat||'-')+'</td><td>'+(s.nama||'-')+'</td><td>'+us+'</td><td>'+formatDate(s.tanggal)+'</td><td><div class="action-btns"><button class="btn-action btn-view" data-view-surat-guru="'+i+'" title="Lihat"><i class="fas fa-eye"></i></button><button class="btn-action btn-delete" data-delete-surat-guru="'+i+'" title="Hapus"><i class="fas fa-trash"></i></button></div></td></tr>';}
        tb.innerHTML=h;
    }

    // ==========================================
    // PDF & SHARING
    // ==========================================
    function cetakPDF(){
        var sd=window.currentSuratData;if(!sd){showToast('Tidak ada data surat!','error');return;}
        if(!sd.saved){if(sd.type==='siswa')saveSuratSiswaToHistory();else if(sd.type==='guru')saveSuratGuruToHistory();sd.saved=true;}
        var ps=sd.kertas==='f4'?'215mm 330mm':'A4';
        var pc='<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Cetak Surat</title><style>@page{size:'+ps+';margin:20mm 25mm 20mm 30mm;}*{margin:0;padding:0;box-sizing:border-box;}body{font-family:"Times New Roman",serif;font-size:12pt;line-height:1.5;color:#000;}.surat-kop{display:flex;align-items:center;border-bottom:3px double black;padding-bottom:10px;margin-bottom:20px;gap:15px;}.surat-kop .logo{width:70px;height:70px;object-fit:contain;}.surat-kop .kop-text{flex:1;text-align:center;}.surat-kop .kop-text .pemerintah{font-size:12pt;font-weight:bold;}.surat-kop .kop-text .dinas{font-size:13pt;font-weight:bold;}.surat-kop .kop-text .sekolah{font-size:16pt;font-weight:bold;}.surat-kop .kop-text .alamat{font-size:9pt;font-style:italic;}.surat-judul{text-align:center;margin-bottom:5px;font-weight:bold;font-size:14pt;text-decoration:underline;}.surat-nomor{text-align:center;margin-bottom:20px;font-size:11pt;}.surat-isi{margin-bottom:10px;text-align:justify;}.surat-data-table{margin:10px 0 15px 30px;}.surat-data-table tr td{padding:2px 8px;vertical-align:top;font-size:12pt;}.surat-data-table tr td:first-child{width:160px;white-space:nowrap;}.surat-data-table tr td:nth-child(2){width:10px;text-align:center;}.surat-ttd{float:right;text-align:center;margin-top:30px;width:250px;}.surat-ttd .ttd-space{height:60px;}.surat-ttd .nama-kepsek{font-weight:bold;text-decoration:underline;}</style></head><body>'+sd.html+'</body></html>';
        var pw=window.open('','_blank');if(pw){pw.document.write(pc);pw.document.close();pw.onload=function(){setTimeout(function(){pw.print();},500);};}
        showToast('Surat siap dicetak!','success');
    }

    function kirimWhatsApp(){
        var sd=window.currentSuratData;if(!sd)return;if(!sd.saved){if(sd.type==='siswa')saveSuratSiswaToHistory();else if(sd.type==='guru')saveSuratGuruToHistory();sd.saved=true;}
        var n=prompt('Masukkan nomor WhatsApp (contoh: 628123456789):');if(!n)return;
        var cn=n.replace(/\D/g,'');if(cn.charAt(0)==='0')cn='62'+cn.substring(1);
        var id=JSON.parse(localStorage.getItem('identitasSekolah')||'{}');
        var msg=encodeURIComponent('*Surat dari '+(id.namaSekolah||'Sekolah')+'*\n\nNomor: '+(sd.nomorSurat||'-')+'\nNama: '+(sd.nama||'-')+'\n\n_Silakan cetak surat melalui sistem._');
        window.open('https://wa.me/'+cn+'?text='+msg,'_blank');showToast('Mengarahkan ke WhatsApp...','info');
    }

    function kirimEmail(){
        var sd=window.currentSuratData;if(!sd)return;if(!sd.saved){if(sd.type==='siswa')saveSuratSiswaToHistory();else if(sd.type==='guru')saveSuratGuruToHistory();sd.saved=true;}
        var id=JSON.parse(localStorage.getItem('identitasSekolah')||'{}');
        var subj=encodeURIComponent('Surat - '+(sd.nomorSurat||'')+' - '+(id.namaSekolah||'Sekolah'));
        var body=encodeURIComponent('Yth. Bapak/Ibu,\n\nNomor Surat: '+(sd.nomorSurat||'-')+'\nNama: '+(sd.nama||'-')+'\n\nHormat kami,\n'+(id.namaKepsek||'Kepala Sekolah'));
        window.open('mailto:?subject='+subj+'&body='+body,'_blank');showToast('Mengarahkan ke Email...','info');
    }

    // ==========================================
    // EVENT LISTENERS
    // ==========================================
    document.addEventListener('DOMContentLoaded', function(){

        // Login
        document.getElementById('loginForm').addEventListener('submit',function(e){e.preventDefault();doLogin(document.getElementById('loginUser').value.trim(),document.getElementById('loginPass').value);});
        document.getElementById('togglePassBtn').addEventListener('click',function(){var p=document.getElementById('loginPass'),ic=document.getElementById('eyeIcon');if(p.type==='password'){p.type='text';ic.className='fas fa-eye-slash';}else{p.type='password';ic.className='fas fa-eye';}});
        document.getElementById('logoutBtn').addEventListener('click',doLogout);

        // Nav
        var navs=document.querySelectorAll('[data-nav]');for(var i=0;i<navs.length;i++) navs[i].addEventListener('click',function(e){e.preventDefault();showPage(this.getAttribute('data-nav'));});
        document.getElementById('sidebarToggle').addEventListener('click',toggleSidebar);
        document.getElementById('mobileToggle').addEventListener('click',toggleSidebar);

        // Modal
        document.getElementById('modalOverlay').addEventListener('click',closeModal);
        var cls=document.querySelectorAll('[data-close="modal"]');for(var c=0;c<cls.length;c++) cls[c].addEventListener('click',closeModal);

        // Settings
        document.getElementById('settingsForm').addEventListener('submit',function(e){e.preventDefault();var cr=getCredentials(),cp=cr.password||DEFAULT_PASS,op=document.getElementById('oldPassword').value,np=document.getElementById('newPassword').value,cfp=document.getElementById('confirmPassword').value,nu=document.getElementById('newUsername').value;if(op!==cp){showToast('Password lama salah!','error');return;}if(np!==cfp){showToast('Password baru tidak cocok!','error');return;}if(np.length<4){showToast('Password minimal 4 karakter!','error');return;}var nc={username:nu||cr.username||DEFAULT_USER,password:np};localStorage.setItem('credentials',JSON.stringify(nc));document.getElementById('adminName').textContent=nc.username;document.getElementById('welcomeName').textContent=nc.username;showToast('Password berhasil diubah!','success');this.reset();});

        // Identitas
        document.getElementById('identitasForm').addEventListener('submit',function(e){e.preventDefault();saveIdentitas();});
        document.getElementById('kodeSurat').addEventListener('input',updatePreviewNomor);
        document.getElementById('tahunSurat').addEventListener('input',updatePreviewNomor);
        document.getElementById('nomorSurat').addEventListener('input',updatePreviewNomor);

        // Logo Upload - realtime
        document.getElementById('logoDinas').addEventListener('change',function(){previewLogo('logoDinas','logoDinas');});
        document.getElementById('logoSekolah').addEventListener('change',function(){previewLogo('logoSekolah','logoSekolah');});

        // Logo Delete
        document.getElementById('btnHapusLogoDinas').addEventListener('click',function(){
            if(confirm('Hapus logo Pemda?')){
                localStorage.removeItem('logoDinas');
                updateAllLogos();
                showToast('Logo Pemda dihapus!','info');
            }
        });
        document.getElementById('btnHapusLogoSekolah').addEventListener('click',function(){
            if(confirm('Hapus logo Sekolah?')){
                localStorage.removeItem('logoSekolah');
                updateAllLogos();
                showToast('Logo Sekolah dihapus!','info');
            }
        });

        // Data Guru
        document.getElementById('btnAddGuru').addEventListener('click',showAddGuruModal);
        document.getElementById('btnImportGuru').addEventListener('click',function(){document.getElementById('importGuru').click();});
        document.getElementById('importGuru').addEventListener('change',importGuruExcel);
        document.getElementById('btnTemplateGuru').addEventListener('click',downloadTemplateGuru);
        document.getElementById('btnHapusSemuaGuru').addEventListener('click',hapusSemuaGuru);
        document.getElementById('searchGuru').addEventListener('keyup',renderGuruTable);
        document.getElementById('formTambahGuru').addEventListener('submit',function(e){e.preventDefault();saveGuru();});

        // Data Siswa
        document.getElementById('btnAddSiswa').addEventListener('click',showAddSiswaModal);
        document.getElementById('btnImportSiswa').addEventListener('click',function(){document.getElementById('importSiswa').click();});
        document.getElementById('importSiswa').addEventListener('change',importSiswaExcel);
        document.getElementById('btnTemplateSiswa').addEventListener('click',downloadTemplateSiswa);
        document.getElementById('btnHapusSemuaSiswa').addEventListener('click',hapusSemuaSiswa);
        document.getElementById('searchSiswa').addEventListener('keyup',renderSiswaTable);
        document.getElementById('formTambahSiswa').addEventListener('submit',function(e){e.preventDefault();saveSiswa();});

        // Surat Siswa
        var stc=document.querySelectorAll('[data-surat]');for(var st=0;st<stc.length;st++) stc[st].addEventListener('click',function(){buatSuratSiswa(this.getAttribute('data-surat'));});
        document.getElementById('selectSiswa').addEventListener('change',fillSiswaData);
        document.getElementById('btnPreviewSuratSiswa').addEventListener('click',previewSuratSiswa);
        document.getElementById('btnCancelSuratSiswa').addEventListener('click',function(){document.getElementById('formSuratSiswa').style.display='none';});

        // Surat Guru
        document.getElementById('btnBuatSuratGuru').addEventListener('click',buatSuratGuru);
        document.getElementById('selectGuru').addEventListener('change',fillGuruData);
        document.getElementById('btnPreviewSuratGuru').addEventListener('click',previewSuratGuru);
        document.getElementById('btnCancelSuratGuru').addEventListener('click',function(){document.getElementById('formSuratGuru').style.display='none';});

        // PDF & Sharing
        document.getElementById('btnCetakPDF').addEventListener('click',cetakPDF);
        document.getElementById('btnKirimWA').addEventListener('click',kirimWhatsApp);
        document.getElementById('btnKirimEmail').addEventListener('click',kirimEmail);

        // Delegated Events
        document.addEventListener('click',function(e){
            var t;
            t=e.target.closest('[data-edit-guru]');if(t){editGuru(parseInt(t.getAttribute('data-edit-guru')));return;}
            t=e.target.closest('[data-delete-guru]');if(t){hapusGuru(parseInt(t.getAttribute('data-delete-guru')));return;}
            t=e.target.closest('[data-edit-siswa]');if(t){editSiswa(parseInt(t.getAttribute('data-edit-siswa')));return;}
            t=e.target.closest('[data-delete-siswa]');if(t){hapusSiswa(parseInt(t.getAttribute('data-delete-siswa')));return;}
            t=e.target.closest('[data-view-surat-siswa]');if(t){var idx=parseInt(t.getAttribute('data-view-surat-siswa'));var r=JSON.parse(localStorage.getItem('riwayatSuratSiswa')||'[]');var su=r[idx];if(su){document.getElementById('suratPreviewContainer').innerHTML=su.html;window.currentSuratData={type:'siswa',kertas:su.kertas||'a4',html:su.html,nama:su.nama,nomorSurat:su.nomorSurat,saved:true};openModal('modalPreviewSurat');}return;}
            t=e.target.closest('[data-delete-surat-siswa]');if(t){if(confirm('Hapus riwayat surat ini?')){var idx2=parseInt(t.getAttribute('data-delete-surat-siswa'));var r2=JSON.parse(localStorage.getItem('riwayatSuratSiswa')||'[]');r2.splice(idx2,1);localStorage.setItem('riwayatSuratSiswa',JSON.stringify(r2));renderRiwayatSuratSiswa();showToast('Riwayat dihapus!','info');}return;}
            t=e.target.closest('[data-view-surat-guru]');if(t){var idx3=parseInt(t.getAttribute('data-view-surat-guru'));var r3=JSON.parse(localStorage.getItem('riwayatSuratGuru')||'[]');var su3=r3[idx3];if(su3){document.getElementById('suratPreviewContainer').innerHTML=su3.html;window.currentSuratData={type:'guru',kertas:su3.kertas||'a4',html:su3.html,nama:su3.nama,nomorSurat:su3.nomorSurat,saved:true};openModal('modalPreviewSurat');}return;}
            t=e.target.closest('[data-delete-surat-guru]');if(t){if(confirm('Hapus riwayat surat ini?')){var idx4=parseInt(t.getAttribute('data-delete-surat-guru'));var r4=JSON.parse(localStorage.getItem('riwayatSuratGuru')||'[]');r4.splice(idx4,1);localStorage.setItem('riwayatSuratGuru',JSON.stringify(r4));renderRiwayatSuratGuru();showToast('Riwayat dihapus!','info');}return;}
        });

        // Init
        checkAuth();
    });

})();