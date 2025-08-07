import { Component, OnInit,ViewChild } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { PdfViewerComponent } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-venue-layout',
  templateUrl: './venue-layout.page.html',
  styleUrls: ['./venue-layout.page.scss'],
  standalone:false
})
export class VenueLayoutPage implements OnInit {
  @ViewChild('pdfViewer') pdfViewer!: PdfViewerComponent;

  pdfSrc: string | Uint8Array | null = null;
  loading = true;
  error = '';
  page = 1;
  totalPages = 0;
  zoom = 1.0;
  originalSize = true;

  constructor(private route: ActivatedRoute,private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const pdfUrl = params['pdfUrl'];
      if (pdfUrl) {
        this.loadPdf(pdfUrl);
      } else {
        this.error = 'No PDF URL provided.';
        this.loading = false;
      }
    });
  }

  private loadPdf(pdfUrl: string) {
    this.loading = true;
    this.error = '';
    
    if (pdfUrl.startsWith('http')) {
      // For remote files
      fetch(pdfUrl)
        .then(response => response.arrayBuffer())
        .then(buffer => {
          this.pdfSrc = new Uint8Array(buffer);
        })
        .catch(err => {
          console.error('Error loading PDF:', err);
          this.error = 'Failed to load the PDF. Please try again later.';
        })
        .finally(() => {
          this.loading = false;
        });
    } else {
      // For local files
      this.pdfSrc = pdfUrl;
      this.loading = false;
    }
  }

  onLoadComplete(pdf: any) {
    this.totalPages = pdf.numPages;
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
    }
  }

  zoomIn() {
    this.zoom += 0.25;
  }

  zoomOut() {
    if (this.zoom > 0.5) {
      this.zoom -= 0.25;
    }
  }

  rotate(angle: number) {
    // Note: Rotation might not be supported in all versions of ng2-pdf-viewer
    // This is a placeholder in case you want to implement rotation
  }

  goBack() {
    this.router.navigate(['/home/dashboard']);
  }
}

