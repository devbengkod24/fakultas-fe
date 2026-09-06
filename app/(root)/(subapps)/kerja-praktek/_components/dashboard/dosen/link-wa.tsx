"use client";

import React, { useEffect, useState } from "react";

import useSWR from 'swr';
import { Edit, MessageCircle } from 'lucide-react';

import { DashboardService } from '@/api/kerja-praktek';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { handleToastResponse } from '@/lib/toast-response';

const DashboardDosenLinkWa = () => {
  const [linkWa, setLinkWa] = useState('');
  const [draftLinkWa, setDraftLinkWa] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saving'>('idle');

  const { data, isLoading, mutate } = useSWR(
    'dashboard-dosen-link-wa',
    () => DashboardService.getLinkWaDosen(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onError: (error) => {
        toast.error('Gagal memuat data link WhatsApp', {
          description: error.message || 'Terjadi kesalahan saat memuat data'
        });
      }
    }
  );

  useEffect(() => {
    if (data?.success && data.data) {
      setLinkWa(data.data);
      setDraftLinkWa(data.data);
    }
  }, [data]);

  useEffect(() => {
    if (!isDialogOpen) {
      setDraftLinkWa(linkWa);
    }
  }, [isDialogOpen, linkWa]);

  const openEditDialog = () => {
    setDraftLinkWa(linkWa);
    setIsDialogOpen(true);
  };

  const saveLinkWa = async () => {
    setStatus('saving');
    const loadingToast = toast.loading('Menyimpan link WhatsApp...');

    try {
      const response = await DashboardService.updateLinkWaDosen({ link_wa: draftLinkWa });

      if (response.success) {
        toast.dismiss(loadingToast);
        handleToastResponse(response);
        setLinkWa(draftLinkWa);
        mutate();
        setIsDialogOpen(false);
        setStatus('idle');
      } else {
        toast.dismiss(loadingToast);
        handleToastResponse(response);
        setStatus('idle');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Gagal menyimpan link WhatsApp');
      setStatus('idle');
      console.error('Error saving WhatsApp link:', error);
    }
  };

  const getStatusIcon = () => {
    if (isLoading || status === 'saving') {
      return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>;
    }
    return null;
  };

  return (
    <Card className="mt-4 rounded-md">
      <CardHeader className="flex-row gap-4 p-4 pb-2">
        <div className="flex items-center">
          <MessageCircle className="text-green-500" />
        </div>
        <div className="flex-col flex-1">
          <CardTitle className="flex items-center justify-between gap-2">
            <span>Link WhatsApp Group</span>
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={openEditDialog}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Link WhatsApp Group</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="linkWa" className="text-sm">
                        URL WhatsApp Group
                      </Label>
                      <Input
                        id="linkWa"
                        type="url"
                        placeholder="Tempel link WhatsApp di sini"
                        value={draftLinkWa}
                        onChange={(e) => setDraftLinkWa(e.target.value)}
                        className="w-full"
                        disabled={isLoading || status === 'saving'}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={status === 'saving'}>
                        Batal
                      </Button>
                      <Button onClick={saveLinkWa} disabled={isLoading || status === 'saving'}>
                        {status === 'saving' ? 'Menyimpan...' : 'OK'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardTitle>
          <div className="text-xs text-gray-500 mt-1">
            Link grup WhatsApp untuk mahasiswa bimbingan
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 break-all">
          {linkWa || 'Link belum ditambahkan'}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardDosenLinkWa;